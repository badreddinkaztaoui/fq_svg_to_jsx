
const parseSvgString = (svgString) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(svgString, 'image/svg+xml');
  
  const errorNode = doc.querySelector('parsererror');
  if (errorNode) {
    throw new Error('Error parsing SVG: ' + errorNode.textContent);
  }
  
  return doc.documentElement;
}

const indent = (level) => {
  return '  '.repeat(level);
}

const convertAttributes = (attributes, isTypescript) => {
  if (!attributes || attributes.length === 0) {
    return '';
  }
  
  const attrMap = {
    'class': 'className',
    'for': 'htmlFor',
    'stroke-width': 'strokeWidth',
    'stroke-linecap': 'strokeLinecap',
    'stroke-linejoin': 'strokeLinejoin',
    'stroke-dasharray': 'strokeDasharray',
    'stroke-dashoffset': 'strokeDashoffset',
    'stroke-miterlimit': 'strokeMiterlimit',
    'fill-rule': 'fillRule',
    'fill-opacity': 'fillOpacity',
    'clip-rule': 'clipRule',
    'clip-path': 'clipPath',
    'xlink:href': 'xlinkHref',
    'font-family': 'fontFamily',
    'font-size': 'fontSize',
    'font-weight': 'fontWeight',
    'text-anchor': 'textAnchor',
    'dominant-baseline': 'dominantBaseline',
    'stop-color': 'stopColor',
    'stop-opacity': 'stopOpacity',
    'color-interpolation-filters': 'colorInterpolationFilters',
    'color-rendering': 'colorRendering',
    'shape-rendering': 'shapeRendering',
    'text-rendering': 'textRendering',
    'image-rendering': 'imageRendering',
  };
  
  const jsxAttrs = [];
  
  for (let i = 0; i < attributes.length; i++) {
    const attr = attributes[i];
    let name = attr.name;
    let value = attr.value;
    
    if (name.includes('-') && !attrMap[name]) {
      name = name.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
    } else if (attrMap[name]) {
      name = attrMap[name];
    }

    if (name.startsWith('data-')) {
      // Keep data-* attributes as they are in JSX
    }
    
    if (name === 'style' && value) {
      const styleObj = parseStyleAttribute(value);
      value = `{${styleObj}}`;
    } else if (
      value.includes('{') || 
      value.match(/^-?[0-9]+(\.[0-9]+)?$/) || 
      value === 'true' || 
      value === 'false'
    ) {
      value = `{${value}}`;
    } else {
      value = `"${value.replace(/"/g, '&quot;')}"`;
    }
    
    jsxAttrs.push(`${name}=${value}`);
  }
  
  return jsxAttrs.join(' ');
}

const parseStyleAttribute = (styleString) => {
  const styles = styleString.split(';').filter(style => style.trim() !== '');
  const styleObj = [];
  
  for (const style of styles) {
    const [property, value] = style.split(':').map(s => s.trim());
    
    if (!property || !value) continue;
    
    const camelProperty = property.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
    
    styleObj.push(`"${camelProperty}": "${value}"`);
  }
  
  return styleObj.join(', ');
}

const convertNodeToJsx = (node, isTypescript, level = 1) => {
  if (node.nodeType === Node.TEXT_NODE) {
    const text = node.textContent.trim();
    return text ? `${indent(level)}${text}\n` : '';
  }

  if (node.nodeType !== Node.ELEMENT_NODE) {
    return '';
  }

  let jsxElement = '';
  const indentation = indent(level);
  
  const tagName = node.tagName.toLowerCase();
  
  jsxElement += `${indentation}<${tagName}`;
  
  const attributes = convertAttributes(node.attributes, isTypescript);
  if (attributes) {
    jsxElement += ` ${attributes}`;
  }
  
  if (node.childNodes.length === 0) {
    jsxElement += ' />\n';
  } else {
    jsxElement += '>\n';
    
    for (let i = 0; i < node.childNodes.length; i++) {
      const childJsx = convertNodeToJsx(node.childNodes[i], isTypescript, level + 1);
      if (childJsx) {
        jsxElement += childJsx;
      }
    }
    
    jsxElement += `${indentation}</${tagName}>\n`;
  }
  
  return jsxElement;
}

const generateComponent = (jsxContent, options) => {
  const {
    componentName,
    defaultExport,
    memo,
    namedExport,
    reactImport,
    typescript,
  } = options;
  
  const propsType = typescript ? 
    `\ninterface ${componentName}Props extends React.SVGProps<SVGSVGElement> {}\n` : '';
  
  let imports = '';
  if (reactImport) {
    if (memo) {
      imports = 'import React, { memo } from \'react\';\n';
    } else {
      imports = 'import * as React from \'react\';\n';
    }
  }
  
  const componentType = typescript ? 
    `React.FC<${componentName}Props>` : '';
  
  const functionParams = typescript ? 
    `(props: ${componentName}Props)` : '(props)';
  
  let componentFunction = '';
  if (memo) {
    componentFunction = `const ${componentName} = memo${functionParams} => (\n${jsxContent});\n`;
  } else {
    componentFunction = `function ${componentName}${functionParams} {\n  return (\n${jsxContent}  );\n}\n`;
  }
  
  let exports = '';
  if (defaultExport && !namedExport) {
    exports = `export default ${componentName};`;
  } else if (!defaultExport && namedExport) {
    exports = `export { ${componentName} };`;
  } else if (defaultExport && namedExport) {
    exports = `export { ${componentName} };\nexport default ${componentName};`;
  }
  
  return `${imports}${propsType}${componentFunction}${exports}`;
}

export const convertSvgToComponent = (svgInput, options = {}) => {

  const defaultOptions = {
    componentName: 'SvgComponent',
    defaultExport: true,
    memo: false,
    namedExport: false,
    reactImport: true,
    typescript: false,
  };

  const config = { ...defaultOptions, ...options };
  
  // Parse SVG
  const svgNode = parseSvgString(svgInput);
  
  // Convert SVG to JSX
  const jsxContent = convertNodeToJsx(svgNode, config.typescript);
  
  // Generate component
  return generateComponent(jsxContent, config);
}

