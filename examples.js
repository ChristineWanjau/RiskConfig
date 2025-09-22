// Example usage of the Risk Configuration API
// Run this after starting the server with: node examples.js

const axios = require('axios');

// You'll need to install axios: npm install axios
// Or use fetch if you prefer

const BASE_URL = 'http://localhost:3000';

async function runExamples() {
    console.log('🚀 Testing Risk Configuration API\n');

    try {
        // 1. Save a risk configuration for portfolio-123
        console.log('1. Saving risk configuration for portfolio-123...');
        const createResponse = await axios.post(`${BASE_URL}/configs/portfolio-123`, {
            riskThreshold: 0.15,
            maxExposure: 1000000,
            riskMetrics: {
                var95: 0.05,
                expectedShortfall: 0.08
            },
            alertSettings: {
                enableAlerts: true,
                thresholds: [0.10, 0.15, 0.20]
            }
        });

        console.log('✅ Saved configuration for:', createResponse.data.data.resourceId);
        console.log('   Configuration:', JSON.stringify(createResponse.data.data.config, null, 2));

        // 2. Get the configuration
        console.log('\n2. Getting configuration for portfolio-123...');
        const getResponse = await axios.get(`${BASE_URL}/configs/portfolio-123`);
        console.log('✅ Retrieved configuration:', JSON.stringify(getResponse.data.data.config, null, 2));

        // 3. Update the configuration
        console.log('\n3. Updating configuration for portfolio-123...');
        const updateResponse = await axios.put(`${BASE_URL}/configs/portfolio-123`, {
            riskThreshold: 0.12,
            maxExposure: 1200000,
            riskMetrics: {
                var95: 0.04,
                expectedShortfall: 0.07
            },
            alertSettings: {
                enableAlerts: true,
                thresholds: [0.08, 0.12, 0.16],
                emailNotifications: true
            },
            lastReviewDate: '2025-09-22'
        });
        console.log('✅ Updated configuration:', JSON.stringify(updateResponse.data.data.config, null, 2));

        // 4. Save another configuration for a different resource
        console.log('\n4. Saving configuration for fund-456...');
        const secondConfigResponse = await axios.post(`${BASE_URL}/configs/fund-456`, {
            riskThreshold: 0.08,
            maxExposure: 2000000,
            riskMetrics: {
                var95: 0.03,
                expectedShortfall: 0.05
            },
            assetClasses: ['equity', 'bonds', 'alternatives'],
            rebalanceFrequency: 'monthly'
        });
        console.log('✅ Saved configuration for:', secondConfigResponse.data.data.resourceId);

        // 5. Get all configurations
        console.log('\n5. Getting all configurations...');
        const allConfigsResponse = await axios.get(`${BASE_URL}/configs`);
        console.log(`✅ Found ${allConfigsResponse.data.count} configuration(s)`);
        allConfigsResponse.data.data.forEach((config, index) => {
            console.log(`   Config ${index + 1}: ${config.resourceId} (Risk Threshold: ${config.config.riskThreshold})`);
        });

        // 6. Delete portfolio-123 configuration
        console.log('\n6. Deleting configuration for portfolio-123...');
        const deleteResponse = await axios.delete(`${BASE_URL}/configs/portfolio-123`);
        console.log('✅ Deleted configuration:', deleteResponse.data.message);

        // 7. Try to get deleted configuration (should return 404)
        console.log('\n7. Trying to get deleted configuration...');
        try {
            await axios.get(`${BASE_URL}/configs/portfolio-123`);
        } catch (error) {
            if (error.response?.status === 404) {
                console.log('✅ Correctly returned 404 for deleted configuration');
            } else {
                throw error;
            }
        }

        // 8. Final configuration count
        console.log('\n8. Final configuration count...');
        const finalCountResponse = await axios.get(`${BASE_URL}/configs`);
        console.log(`✅ Final count: ${finalCountResponse.data.count} configuration(s)`);

        console.log('\n🎉 All examples completed successfully!');

    } catch (error) {
        console.error('❌ Error:', error.response?.data || error.message);
    }
}

// Only run examples if this file is executed directly
if (require.main === module) {
    runExamples();
}

module.exports = { runExamples };