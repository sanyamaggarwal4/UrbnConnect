import type { SustainabilityMetrics } from '../types';

export const MOCK_SUSTAINABILITY_METRICS: SustainabilityMetrics[] = [
    {
        areaName: 'Karol Bagh Central',
        totalTrees: 4120,
        treesNeeded: 850,
        greenCoveragePct: 18,
        deficitZone: true,
        plantationPriority: 'high',
    },
    {
        areaName: 'Rajinder Nagar',
        totalTrees: 8400,
        treesNeeded: 200,
        greenCoveragePct: 32,
        deficitZone: false,
        plantationPriority: 'low',
    },
    {
        areaName: 'Pusa Road Corridor',
        totalTrees: 12500,
        treesNeeded: 50,
        greenCoveragePct: 45,
        deficitZone: false,
        plantationPriority: 'low',
    },
    {
        areaName: 'Arya Samaj Block',
        totalTrees: 1100,
        treesNeeded: 2300,
        greenCoveragePct: 9,
        deficitZone: true,
        plantationPriority: 'critical',
    },
    {
        areaName: 'Ghaffar Market Zone',
        totalTrees: 340,
        treesNeeded: 1800,
        greenCoveragePct: 4,
        deficitZone: true,
        plantationPriority: 'critical',
    },
];
