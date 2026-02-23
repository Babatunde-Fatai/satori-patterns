import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export function DotGrid({ width = 1200, height = 630, foreground = "#d4d4d8", background = "#ffffff", idPrefix, ...rest }) {
    const spacing = rest.spacing ?? 24;
    const dotSize = rest.dotSize ?? 2;
    const baseId = idPrefix ?? `dot-grid-${width}x${height}`;
    const patternId = `${baseId}-pattern`;
    return (_jsxs("svg", { xmlns: "http://www.w3.org/2000/svg", width: width, height: height, viewBox: `0 0 ${width} ${height}`, children: [_jsx("rect", { width: width, height: height, fill: background }), _jsx("defs", { children: _jsx("pattern", { id: patternId, x: "0", y: "0", width: spacing, height: spacing, patternUnits: "userSpaceOnUse", children: _jsx("circle", { cx: spacing / 2, cy: spacing / 2, r: dotSize, fill: foreground }) }) }), _jsx("rect", { width: width, height: height, fill: `url(#${patternId})` })] }));
}
