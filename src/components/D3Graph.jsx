// src/components/D3Graph.jsx
import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { subscribe, unsubscribe, getD3Data } from "../console-monkey-patch";

export default function D3Graph() {
    const svgRef = useRef(null);
    const [data, setData] = useState([]);

    // Listen for d3Data events from console-monkey-patch
    useEffect(() => {
        const handler = (event) => {
            const hapStrings = event.detail || [];

            // Very simple “activity” metric: length of each hap string.
            // Keep only the last 10 entries so the graph doesn’t explode.
            const numeric = hapStrings.map((s) => s.length).slice(-10);

            setData(numeric);
        };

        subscribe("d3Data", handler);
        return () => unsubscribe("d3Data", handler);
    }, []);

    // Draw/ U[pdate the bar chart whenever data changes
    useEffect(() => {
        const svg = d3.select(svgRef.current);
        const width = svgRef.current.clientWidth || 800;
        const height = 220;
        const margin = { top: 20, right: 20, bottom: 25, left: 30 };

        svg.selectAll("*").remove(); // clear previous contents

        if (!data || data.length === 0) {
            // Show “no data” message
            svg
                .append("text")
                .attr("x", width / 2)
                .attr("y", height / 2)
                .attr("text-anchor", "middle")
                .attr("fill", "#888")
                .style("font-size", "14px")
                .text("No Strudel data yet. Run Proc & Play to generate activity.");
            return;
        }

        const x = d3
            .scaleBand()
            .domain(data.map((_, i) => i.toString()))
            .range([margin.left, width - margin.right])
            .padding(0.2);

        const y = d3
            .scaleLinear()
            .domain([0, d3.max(data) || 1])
            .nice()
            .range([height - margin.bottom, margin.top]);

        // Bars
        svg
            .append("g")
            .selectAll("rect")
            .data(data)
            .enter()
            .append("rect")
            .attr("x", (_, i) => x(i.toString()))
            .attr("y", (d) => y(d))
            .attr("width", x.bandwidth())
            .attr("height", (d) => y(0) - y(d))
            .attr("fill", "#0d6efd");

        // X axis
        svg
            .append("g")
            .attr("transform", `translate(0, ${height - margin.bottom})`)
            .call(
                d3
                    .axisBottom(x)
                    .tickFormat((i) => `Run ${Number(i) + 1}`)
            )
            .selectAll("text")
            .style("font-size", "10px");

        // Y axis
        svg
            .append("g")
            .attr("transform", `translate(${margin.left}, 0)`)
            .call(d3.axisLeft(y).ticks(5))
            .selectAll("text")
            .style("font-size", "10px");
    }, [data]);

    return (
        <div className="card mb-3">
            <div className="card-header">Demo Activity Graph (D3)</div>
            <div className="card-body">
                <svg ref={svgRef} width="100%" height="220"></svg>
            </div>
        </div>
    );
}
