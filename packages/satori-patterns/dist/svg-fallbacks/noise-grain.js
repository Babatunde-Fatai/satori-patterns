import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export function NoiseGrain({ width = 1200, height = 630, foreground = "#000000", background = "#f4f4f5", idPrefix, ...rest }) {
    const baseId = idPrefix ?? `noise-grain-${width}x${height}`;
    const filterId = `${baseId}-noise`;
    const opacity = rest.opacity ?? 0.4;
    const baseFrequency = rest.baseFrequency ?? 0.65;
    return (_jsxs("svg", { xmlns: "http://www.w3.org/2000/svg", width: width, height: height, viewBox: `0 0 ${width} ${height}`, children: [_jsx("defs", { children: _jsx("filter", { id: filterId, children: _jsx("feTurbulence", { type: "fractalNoise", baseFrequency: baseFrequency, numOctaves: 4, stitchTiles: "stitch" }) }) }), _jsx("rect", { width: width, height: height, fill: background }), _jsx("rect", { width: width, height: height, filter: `url(#${filterId})`, opacity: opacity })] }));
}
