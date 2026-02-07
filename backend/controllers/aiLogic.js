const fs = require('fs');
const path = require('path');

const getData = (filename) => {
    const filePath = path.join(__dirname, '../data', `${filename}.json`);
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
};

const calculateAI = () => {
    const paints = getData('paints');
    const orders = getData('orders');
    const demandSignals = getData('demandSignals');
    const dealers = getData('dealers');

    const now = new Date();
    
    // Dead Stock Logic: lastSoldDate > 60 days
    const deadStock = paints.filter(p => {
        const lastSold = new Date(p.lastSoldDate);
        const diffDays = Math.ceil((now - lastSold) / (1000 * 60 * 60 * 24));
        return diffDays > 60;
    });

    // Demand Prediction Logic
    const regionalDemand = demandSignals.map(signal => {
        const regionalOrders = orders.filter(o => {
            const dealer = dealers.find(d => d.id === o.dealerId);
            return dealer && dealer.region === signal.region;
        }).length;
        
        // Simple prediction: (Orders * 0.7) + (Searches * 0.05)
        const prediction = (regionalOrders * 0.7) + (signal.searches * 0.05);
        return {
            region: signal.region,
            currentDemand: regionalOrders,
            predictedDemand: Math.round(prediction),
            confidence: 85 + Math.random() * 10
        };
    });

    // Inventory Health Score Logic
    const inventoryPerformance = dealers.map(dealer => {
        const dealerOrders = orders.filter(o => o.dealerId === dealer.id).length;
        const stockUtilization = (dealerOrders / (dealer.inventory || 1)) * 100;
        
        // Health score weighted
        const healthScore = Math.min(100, Math.round(stockUtilization * 1.5 + (Math.random() * 20)));
        return {
            ...dealer,
            healthScore
        };
    });

    // Lost Sales Logic: High searches but low orders
    const lostSales = demandSignals.map(signal => {
        const regionalOrders = orders.filter(o => {
            const dealer = dealers.find(d => d.id === o.dealerId);
            return dealer && dealer.region === signal.region;
        }).reduce((acc, o) => acc + o.quantity, 0);
        
        const potentialDemand = signal.searches * 0.1;
        const lost = Math.max(0, Math.round(potentialDemand - regionalOrders));
        
        return {
            region: signal.region,
            lostUnits: lost,
            lostRevenue: lost * 400 // avg price
        };
    });

    // Recommendations
    const recommendations = [
        { type: 'Transfer', title: 'North to West Transfer', description: 'Surplus of Royal Luxury Emulsion in North. West region facing stockout.', priority: 'High' },
        { type: 'Restock', title: 'Urgent Restock: White Enamel', description: 'South region inventory below safety levels.', priority: 'Medium' },
        { type: 'Discount', title: 'Clearance: Aging Stock', description: 'Apply 15% discount on Distemper in Central region to move dead stock.', priority: 'Low' }
    ];

    return { deadStock, regionalDemand, inventoryPerformance, lostSales, recommendations };
};

module.exports = { calculateAI };
