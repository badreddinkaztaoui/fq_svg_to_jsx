import { transform } from '@svgr/core';
import prettier from 'prettier/standalone';
import prettierPluginBabel from 'prettier/plugins/babel';
import prettierPluginEstree from 'prettier/plugins/estree';

/**
 * Convert SVG to React JSX/TSX component
 * @param {string} svg - SVG string to convert
 * @param {object} options - Conversion options
 * @returns {Promise<string>} The converted component code
 */
export async function convertSvgToComponent(svg, options = {}) {
  if (!svg) return '';
  
  const {
    componentName = 'SvgIcon',
    typescript = false,
    memo = false,
    namedExport = false,
    reactImport = true,
  } = options;
  
  try {
    const svgrConfig = {
      plugins: ['@svgr/plugin-jsx'],
      typescript,
      jsxRuntime: 'automatic',
      memo,
      namedExport,
      ref: false,
      titleProp: false,
      descProp: false,
      expandProps: 'end',
      replaceAttrValues: {
        '#000': 'currentColor',
        '#000000': 'currentColor',
        black: 'currentColor',
      },
      svgProps: {
        width: '1em',
        height: '1em',
      },
      prettier: false,
      componentName,
    };
    
    if (!reactImport) {
      svgrConfig.jsxRuntime = 'classic';
    }
    
    const componentCode = await transform(svg, svgrConfig);
    
    const formattedCode = await prettier.format(componentCode, {
      parser: 'babel',
      plugins: [prettierPluginBabel, prettierPluginEstree],
      semi: true,
      singleQuote: true,
      printWidth: 80,
      tabWidth: 2,
    });
    
    return formattedCode;
  } catch (error) {
    console.error('Error converting SVG:', error);
    throw new Error(`Failed to convert SVG: ${error.message}`);
  }
}

export function createPreviewHtml(svg) {
  if (!svg) return '';
  
  try {
    let viewBox = '0 0 24 24';
    let width = '1em';
    let height = '1em';
    
    // Simple regex to extract attributes (not 100% reliable, but good enough for preview)
    const viewBoxMatch = svg.match(/viewBox=["']([^"']*)["']/i);
    if (viewBoxMatch && viewBoxMatch[1]) {
      viewBox = viewBoxMatch[1];
    }
    
    const widthMatch = svg.match(/width=["']([^"']*)["']/i);
    if (widthMatch && widthMatch[1]) {
      width = widthMatch[1];
    }
    
    const heightMatch = svg.match(/height=["']([^"']*)["']/i);
    if (heightMatch && heightMatch[1]) {
      height = heightMatch[1];
    }
    
    // Extract the content inside SVG tags
    const contentMatch = svg.match(/<svg[^>]*>([\s\S]*)<\/svg>/i);
    const svgContent = contentMatch ? contentMatch[1] : '';
    
    return `<svg 
  xmlns="http://www.w3.org/2000/svg"
  viewBox="${viewBox}" 
  width="${width}" 
  height="${height}"
  style="color: currentColor;"
  focusable="false"
  aria-hidden="true"
>
  ${svgContent}
</svg>`;
  } catch (error) {
    console.error('Error creating preview:', error);
    return '';
  }
}