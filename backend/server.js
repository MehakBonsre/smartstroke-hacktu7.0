const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { calculateAI } = require('./controllers/aiLogic');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Helper function to get data
const getData = (filename) => {
    const filePath = path.join(__dirname, 'data', `${filename}.json`);
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
};

// Helper function to save data
const saveData = (filename, data) => {
    const filePath = path.join(__dirname, 'data', `${filename}.json`);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

// API Endpoints
app.get('/api/paints', (req, res) => {
    res.json(getData('paints'));
});

app.get('/api/dealers', (req, res) => {
    res.json(getData('dealers'));
});

app.get('/api/orders', (req, res) => {
    res.json(getData('orders'));
});

app.get('/api/analytics/dashboard', (req, res) => {
    const ai = calculateAI();
    const paints = getData('paints');
    const totalInventory = paints.reduce((acc, p) => acc + p.warehouseStock + p.dealerStock, 0);
    const lowStockPaints = paints.filter(p => p.dealerStock < 50).length;

    res.json({
        totalInventory,
        lowStockPaints,
        deadStockCount: ai.deadStock.length,
        avgHealthScore: Math.round(ai.inventoryPerformance.reduce((acc, d) => acc + d.healthScore, 0) / ai.inventoryPerformance.length),
        regionalDemand: ai.regionalDemand
    });
});

app.get('/api/analytics/demand', (req, res) => {
    const ai = calculateAI();
    res.json(ai.regionalDemand);
});

app.get('/api/deadstock', (req, res) => {
    const ai = calculateAI();
    res.json(ai.deadStock);
});

app.post('/api/orders/create', (req, res) => {
    const { dealerId, productId, quantity, buyerName } = req.body;
    const orders = getData('orders');
    const newOrder = {
        id: `o${orders.length + 1}`,
        dealerId,
        productId,
        quantity,
        buyerName,
        status: 'Pending',
        deliveryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    };
    orders.push(newOrder);
    saveData('orders', orders);

    // Simulate stock reduction
    const paints = getData('paints');
    const paint = paints.find(p => p.id === productId);
    if (paint) {
        paint.dealerStock = Math.max(0, paint.dealerStock - quantity);
        saveData('paints', paints);
    }

    res.status(201).json(newOrder);
});

app.post('/api/inventory/update', (req, res) => {
    const { productId, warehouseStock, dealerStock } = req.body;
    const paints = getData('paints');
    const index = paints.findIndex(p => p.id === productId);
    if (index !== -1) {
        paints[index].warehouseStock = warehouseStock !== undefined ? warehouseStock : paints[index].warehouseStock;
        paints[index].dealerStock = dealerStock !== undefined ? dealerStock : paints[index].dealerStock;
        saveData('paints', paints);
        res.json(paints[index]);
    } else {
        res.status(404).send('Paint not found');
    }
});

app.get('/api/alerts', (req, res) => {
    const ai = calculateAI();
    const alerts = [
        ...ai.deadStock.map(p => ({ type: 'Warning', title: 'Dead Stock Alert', message: `${p.name} has not sold in 60 days.`, date: new Date().toISOString() })),
        ...ai.lostSales.filter(s => s.lostUnits > 50).map(s => ({ type: 'Critical', title: 'Lost Sales Alert', message: `High potential demand in ${s.region} region. Unmet units: ${s.lostUnits}`, date: new Date().toISOString() }))
    ];
    res.json(alerts);
});

app.get('/api/ai/recommendations', (req, res) => {
    const ai = calculateAI();
    res.json(ai.recommendations);
});

// --- Resale (PaintCycle) APIs ---

app.get('/api/resale/list', (req, res) => {
    const resale = getData('resale');
    const enrichedResale = resale.map(item => {
        const daysOpen = (new Date() - new Date(item.createdAt)) / (1000 * 60 * 60 * 24);
        let suggestion = null;
        if (item.status === 'Active' && daysOpen > 10) {
            suggestion = "Reduce price to speed up sale";
        }

        // Simulated high demand logic
        const samePaintCount = resale.filter(r => r.paintName === item.paintName).length;
        const tag = samePaintCount > 1 ? "High resale demand" : null;

        return { ...item, suggestion, tag };
    });
    res.json(enrichedResale);
});

app.get('/api/resale/my-listings', (req, res) => {
    const { sellerId } = req.query;
    const resale = getData('resale');
    const myItems = resale.filter(item => item.sellerId === sellerId);
    res.json(myItems);
});

app.post('/api/resale/create', (req, res) => {
    const { sellerId, paintName, quantity, condition, price, location } = req.body;
    const resale = getData('resale');
    const newItem = {
        id: `rs${resale.length + 1}`,
        sellerId,
        paintName,
        quantity: parseFloat(quantity),
        condition,
        price: parseFloat(price),
        location,
        status: 'Active',
        createdAt: new Date().toISOString()
    };
    resale.push(newItem);
    saveData('resale', resale);
    res.status(201).json(newItem);
});

app.post('/api/resale/buy', (req, res) => {
    const { id, quantity: buyQty } = req.body;
    const resale = getData('resale');
    const index = resale.findIndex(item => item.id === id);
    if (index !== -1) {
        if (resale[index].quantity >= buyQty) {
            resale[index].quantity -= buyQty;
            if (resale[index].quantity === 0) {
                resale[index].status = 'Sold';
            }
            saveData('resale', resale);
            res.json(resale[index]);
        } else {
            res.status(400).send('Insufficient quantity available');
        }
    } else {
        res.status(404).send('Listing not found');
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
