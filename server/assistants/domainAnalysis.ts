/**
 * OpenAI Assistant Integration for Domain Analysis
 * 
 * This module handles communication with the OpenAI Assistant API
 * to generate domain analysis based on chart images.
 */

import 'dotenv/config';
import OpenAI from 'openai';
import type { DomainAnalysisResponse } from '../types/domain';
import { getDomainConfig } from '../../shared/domainConfig';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: 'https://api.openai.com/v1',  // Direct OpenAI API
});

const ASSISTANT_ID = process.env.OPENAI_ASSISTANT_ID || 'asst_yV08iHKU0cx8V7kt9qdYzeSs';

/**
 * Generate domain analysis using OpenAI Assistant
 * 
 * @param dimensionCode - Domain code (e.g., 'macro', 'leadership')
 * @param asOfDate - Analysis date (YYYY-MM-DD format)
 * @returns Domain analysis JSON
 */
export async function generateDomainAnalysis(
  dimensionCode: string,
  asOfDate: string
): Promise<DomainAnalysisResponse> {
  // Get domain configuration
  const domainConfig = getDomainConfig(dimensionCode);
  if (!domainConfig) {
    throw new Error(`Invalid domain code: ${dimensionCode}`);
  }

  console.log(`[Domain Analysis] Starting analysis for ${domainConfig.name} (${dimensionCode})`);
  console.log(`[Domain Analysis] As of date: ${asOfDate}`);
  console.log(`[Domain Analysis] Indicators: ${domainConfig.indicators.length}`);

  // Collect all chart URLs (long-term + short-term)
  const chartUrls: string[] = [];
  for (const indicator of domainConfig.indicators) {
    if (indicator.longTermChartUrl) {
      chartUrls.push(indicator.longTermChartUrl);
    }
    chartUrls.push(indicator.shortTermChartUrl);
  }

  console.log(`[Domain Analysis] Total charts: ${chartUrls.length}`);

  // Create instructions for the assistant
  const instructions = `
Analyze the ${domainConfig.name} domain for ${asOfDate}.

Domain: ${domainConfig.name}
Description: ${domainConfig.description}
Indicators: ${domainConfig.indicators.map(i => `${i.name} (${i.symbol})`).join(', ')}

You have been provided with ${chartUrls.length} charts:
${domainConfig.indicators.map((ind, idx) => {
  const parts = [];
  if (ind.longTermChartUrl) {
    parts.push(`- ${ind.name} (${ind.symbol}) - Long-term chart`);
  }
  parts.push(`- ${ind.name} (${ind.symbol}) - Short-term chart`);
  return parts.join('\n');
}).join('\n')}

Please analyze each indicator across both timeframes and provide a comprehensive domain analysis in the specified JSON format.
  `.trim();

  try {
    // Step 1: Create a thread
    console.log('[Domain Analysis] Creating thread...');
    const thread = await openai.beta.threads.create();
    console.log(`[Domain Analysis] Thread created: ${thread.id}`);

    // Step 2: Add message with image URLs
    console.log('[Domain Analysis] Adding message with chart URLs...');
    const messageContent: Array<any> = [
      {
        type: 'text',
        text: instructions,
      },
    ];

    // Add each chart URL as an image
    for (const url of chartUrls) {
      messageContent.push({
        type: 'image_url',
        image_url: {
          url: url,
        },
      });
    }

    await openai.beta.threads.messages.create(thread.id, {
      role: 'user',
      content: messageContent,
    });
    console.log(`[Domain Analysis] Message added with ${chartUrls.length} chart images`);

    // Step 3: Run the assistant
    console.log('[Domain Analysis] Starting assistant run...');
    const run = await openai.beta.threads.runs.create(thread.id, {
      assistant_id: ASSISTANT_ID,
    });
    console.log(`[Domain Analysis] Run started: ${run.id}`);

    // Step 4: Wait for completion
    console.log('[Domain Analysis] Waiting for completion...');
    let runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
    
    let attempts = 0;
    const maxAttempts = 60; // 5 minutes (60 * 5 seconds)
    
    while (runStatus.status !== 'completed' && attempts < maxAttempts) {
      if (runStatus.status === 'failed' || runStatus.status === 'cancelled' || runStatus.status === 'expired') {
        throw new Error(`Assistant run ${runStatus.status}: ${runStatus.last_error?.message || 'Unknown error'}`);
      }

      console.log(`[Domain Analysis] Status: ${runStatus.status} (attempt ${attempts + 1}/${maxAttempts})`);
      await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5 seconds
      runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
      attempts++;
    }

    if (runStatus.status !== 'completed') {
      throw new Error(`Assistant run timed out after ${maxAttempts * 5} seconds`);
    }

    console.log('[Domain Analysis] Run completed!');

    // Step 5: Retrieve messages
    console.log('[Domain Analysis] Retrieving messages...');
    const messages = await openai.beta.threads.messages.list(thread.id);
    
    // Get the assistant's response (first message)
    const assistantMessage = messages.data.find(msg => msg.role === 'assistant');
    if (!assistantMessage) {
      throw new Error('No assistant response found');
    }

    // Extract text content
    const textContent = assistantMessage.content.find(c => c.type === 'text');
    if (!textContent || textContent.type !== 'text') {
      throw new Error('No text content in assistant response');
    }

    const responseText = textContent.text.value;
    console.log('[Domain Analysis] Response received, length:', responseText.length);

    // Step 6: Parse JSON response
    console.log('[Domain Analysis] Parsing JSON...');
    console.log('[Domain Analysis] Response preview:', responseText.substring(0, 200));
    
    let jsonText = responseText;
    
    // Step 1: Remove markdown code blocks if present (```json ... ```)
    jsonText = jsonText.replace(/^```json\s*\n?/i, '').replace(/\n?```\s*$/i, '').trim();
    console.log('[Domain Analysis] After removing markdown blocks, length:', jsonText.length);
    
    // Step 2: If still no valid JSON, extract JSON object from text
    // This handles cases where OpenAI adds leading text before JSON
    if (!jsonText.startsWith('{')) {
      console.log('[Domain Analysis] Leading text detected, extracting JSON object...');
      const jsonStart = jsonText.indexOf('{');
      const jsonEnd = jsonText.lastIndexOf('}');
      if (jsonStart !== -1 && jsonEnd !== -1) {
        jsonText = jsonText.substring(jsonStart, jsonEnd + 1);
        console.log('[Domain Analysis] Extracted JSON from position', jsonStart, 'to', jsonEnd);
      } else {
        console.error('[Domain Analysis] No JSON object found in response');
        throw new Error('No JSON object found in assistant response');
      }
    }

    console.log('[Domain Analysis] Final JSON text length:', jsonText.length);
    console.log('[Domain Analysis] JSON starts with:', jsonText.substring(0, 50));
    
    let analysis: DomainAnalysisResponse;
    try {
      analysis = JSON.parse(jsonText);
      console.log('[Domain Analysis] JSON parsed successfully');
    } catch (parseError) {
      console.error('[Domain Analysis] JSON parse error:', parseError);
      console.error('[Domain Analysis] Failed JSON text (first 500 chars):', jsonText.substring(0, 500));
      throw new Error(`Failed to parse JSON response: ${parseError instanceof Error ? parseError.message : 'Unknown error'}`);
    }
    console.log(`[Domain Analysis] Indicators analyzed: ${analysis.indicators?.length || 0}`);

    // Validate response structure
    if (!analysis.dimension_code || !analysis.dimension_name || !analysis.indicators) {
      throw new Error('Invalid response structure: missing required fields');
    }

    console.log('[Domain Analysis] Analysis complete!');
    return analysis;

  } catch (error) {
    console.error('[Domain Analysis] Error:', error);
    throw error;
  }
}

/**
 * Test function to verify OpenAI Assistant integration
 */
export async function testDomainAnalysis() {
  console.log('=== Testing Domain Analysis ===');
  
  try {
    const result = await generateDomainAnalysis('macro', '2025-01-19');
    console.log('✅ Test successful!');
    console.log('Response:', JSON.stringify(result, null, 2));
    return result;
  } catch (error) {
    console.error('❌ Test failed:', error);
    throw error;
  }
}

