const { ethers } = require('ethers');
const fs = require('fs');
const path = require('path');

// Generate wallets for merchants and beneficiaries
function generateWallets() {
    console.log('🔐 Generating wallets for merchants and beneficiaries...\n');

    const merchants = [
        { id: '1', name: 'Green Grocery Store' },
        { id: '2', name: 'Tech Solutions Inc' },
        { id: '3', name: 'Fashion Forward' },
        { id: '4', name: 'Health & Wellness Center' },
        { id: '5', name: 'Local Restaurant' }
    ];

    const beneficiaries = [
        { id: '1', name: 'Alice Johnson' },
        { id: '2', name: 'Bob Smith' },
        { id: '3', name: 'Carol Davis' },
        { id: '4', name: 'David Wilson' },
        { id: '5', name: 'Eva Brown' },
        { id: '6', name: 'Frank Miller' }
    ];

    const walletData = {
        merchants: {},
        beneficiaries: {},
        generatedAt: new Date().toISOString()
    };

    // Generate merchant wallets
    console.log('📊 Generating merchant wallets:');
    merchants.forEach(merchant => {
        const wallet = ethers.Wallet.createRandom();
        walletData.merchants[merchant.id] = {
            address: wallet.address,
            privateKey: wallet.privateKey,
            mnemonic: wallet.mnemonic?.phrase
        };
        console.log(`  ${merchant.name}: ${wallet.address}`);
    });

    console.log('\n👥 Generating beneficiary wallets:');
    // Generate beneficiary wallets
    beneficiaries.forEach(beneficiary => {
        const wallet = ethers.Wallet.createRandom();
        walletData.beneficiaries[beneficiary.id] = {
            address: wallet.address,
            privateKey: wallet.privateKey,
            mnemonic: wallet.mnemonic?.phrase
        };
        console.log(`  ${beneficiary.name}: ${wallet.address}`);
    });

    // Save to file
    const outputPath = path.join(__dirname, '..', 'data', 'wallets.json');
    const dataDir = path.dirname(outputPath);

    if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
    }

    fs.writeFileSync(outputPath, JSON.stringify(walletData, null, 2));

    console.log(`\n✅ Wallets generated and saved to: ${outputPath}`);
    console.log(`📊 Total wallets generated: ${merchants.length + beneficiaries.length}`);
    console.log('⚠️  Remember: These are demo wallets for development only!');

    return walletData;
}

// Generate TypeScript file with wallet addresses
function generateWalletConstants(walletData) {
    console.log('\n📝 Generating TypeScript constants...');

    const tsContent = `// Auto-generated wallet addresses
// Generated on: ${new Date().toISOString()}
// ⚠️  These are demo wallets for development only!

export const MERCHANT_WALLETS = {
${Object.entries(walletData.merchants).map(([id, wallet]) =>
        `  ${id}: '${wallet.address}'`
    ).join(',\n')}
} as const;

export const BENEFICIARY_WALLETS = {
${Object.entries(walletData.beneficiaries).map(([id, wallet]) =>
        `  ${id}: '${wallet.address}'`
    ).join(',\n')}
} as const;

export type MerchantWalletId = keyof typeof MERCHANT_WALLETS;
export type BeneficiaryWalletId = keyof typeof BENEFICIARY_WALLETS;
`;

    const tsPath = path.join(__dirname, '..', 'src', 'data', 'walletAddresses.ts');
    fs.writeFileSync(tsPath, tsContent);

    console.log(`✅ TypeScript constants saved to: ${tsPath}`);
}

// Run the script
if (require.main === module) {
    try {
        const walletData = generateWallets();
        generateWalletConstants(walletData);
        console.log('\n🎉 Wallet generation complete!');
    } catch (error) {
        console.error('❌ Error generating wallets:', error);
        process.exit(1);
    }
}

module.exports = { generateWallets, generateWalletConstants };
