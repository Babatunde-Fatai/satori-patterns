import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export function DiagonalCrosshatch({ width = 1200, height = 630, foreground = "#a1a1aa", background = "#ffffff", idPrefix, ...rest }) {
    const spacing = rest.spacing ?? 24;
    const strokeWidth = rest.strokeWidth ?? 1;
    const opacity = rest.opacity ?? 0.5;
    const baseId = idPrefix ?? `diagonal-crosshatch-${width}x${height}`;
    const patternId = `${baseId}-pattern`;
    return (_jsxs("svg", { xmlns: "http://www.w3.org/2000/svg", width: width, height: height, viewBox: `0 0 ${width} ${height}`, children: [_jsx("rect", { width: width, height: height, fill: background }), _jsx("defs", { children: _jsxs("pattern", { id: patternId, x: "0", y: "0", width: spacing, height: spacing, patternUnits: "userSpaceOnUse", children: [_jsx("line", { x1: "0", y1: spacing, x2: spacing, y2: "0", stroke: foreground, strokeWidth: strokeWidth, opacity: opacity }), _jsx("line", { x1: "0", y1: "0", x2: spacing, y2: spacing, stroke: foreground, strokeWidth: strokeWidth, opacity: opacity })] }) }), _jsx("rect", { width: width, height: height, fill: `url(#${patternId})` })] }));
}
