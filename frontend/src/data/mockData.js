export const mockDashboard = {
    totalInventory: 24500,
    lowStockPaints: 12,
    deadStockCount: 5,
    avgHealthScore: 78,
    regionalDemand: [
        { region: 'North', currentDemand: 450, predictedDemand: 600, lostSales: 150 },
        { region: 'South', currentDemand: 800, predictedDemand: 750, lostSales: 0 },
        { region: 'West', currentDemand: 300, predictedDemand: 550, lostSales: 250 },
        { region: 'East', currentDemand: 200, predictedDemand: 180, lostSales: 0 },
        { region: 'Central', currentDemand: 150, predictedDemand: 400, lostSales: 250 },
    ]
};

export const mockRecommendations = [
    { title: 'Transfer Surplus', description: 'Move 200L of Royal Gloss from South to North hub.', priority: 'High' },
    { title: 'Liquidation Alert', description: '500L of Matte Finish in West region is aging. Suggest 20% discount.', priority: 'Medium' },
    { title: 'Restock Required', description: 'Inventory in Central region below threshold for WeatherProof range.', priority: 'High' }
];

export const mockInventory = [
    { id: 'p1', name: 'Royal Silk Gloss', category: 'Premium Interior', warehouseStock: 500, dealerStock: 120, price: 450, region: 'North' },
    { id: 'p2', name: 'WeatherShield Max', category: 'Exterior', warehouseStock: 800, dealerStock: 40, price: 600, region: 'South' },
    { id: 'p3', name: 'Matte Finish Pro', category: 'Standard Interior', warehouseStock: 200, dealerStock: 15, price: 350, region: 'West' },
    { id: 'p4', name: 'EcoPure Washable', category: 'Premium Interior', warehouseStock: 1200, dealerStock: 300, price: 550, region: 'North' },
    { id: 'p5', name: 'MetalArmor Chrome', category: 'Enamel', warehouseStock: 100, dealerStock: 5, price: 750, region: 'Central' }
];

export const mockAlerts = [
    { type: 'Critical', title: 'Lost Sales Alert', message: 'High potential demand in West region. Unmet units: 250', date: new Date().toISOString() },
    { type: 'Warning', title: 'Dead Stock Alert', message: 'Matte Finish Pro has not sold in 60 days.', date: new Date().toISOString() },
    { type: 'Info', title: 'Inventory Sync', message: 'Regional warehouse stocks synchronized successfully.', date: new Date().toISOString() }
];
