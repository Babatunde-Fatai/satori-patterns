import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export function LineGrid({ width = 1200, height = 630, foreground = "#e4e4e7", background = "#ffffff", idPrefix, ...rest }) {
    const spacing = rest.spacing ?? 32;
    const strokeWidth = rest.strokeWidth ?? 1;
    const baseId = idPrefix ?? `line-grid-${width}x${height}`;
    const patternId = `${baseId}-pattern`;
    return (_jsxs("svg", { xmlns: "http://www.w3.org/2000/svg", width: width, height: height, viewBox: `0 0 ${width} ${height}`, children: [_jsx("rect", { width: width, height: height, fill: background }), _jsx("defs", { children: _jsx("pattern", { id: patternId, x: "0", y: "0", width: spacing, height: spacing, patternUnits: "userSpaceOnUse", children: _jsx("path", { d: `M ${spacing} 0 L 0 0 0 ${spacing}`, fill: "none", stroke: foreground, strokeWidth: strokeWidth }) }) }), _jsx("rect", { width: width, height: height, fill: `url(#${patternId})` })] }));
}
