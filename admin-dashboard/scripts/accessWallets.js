const fs = require('fs');
const path = require('path');

// Access wallet data including private keys
function accessWallets() {
    const walletPath = path.join(__dirname, '..', 'data', 'wallets.json');

    if (!fs.existsSync(walletPath)) {
        console.log('❌ No wallet data found. Please run "npm run generate-wallets" first.');
        return null;
    }

    try {
        const walletData = JSON.parse(fs.readFileSync(walletPath, 'utf8'));
        return walletData;
    } catch (error) {
        console.error('❌ Error reading wallet data:', error);
        return null;
    }
}

// Display all wallet information
function displayAllWallets() {
    console.log('🔐 Wallet Information (including private keys)\n');

    const walletData = accessWallets();
    if (!walletData) return;

    console.log('📊 MERCHANT WALLETS:');
    console.log('='.repeat(50));
    Object.entries(walletData.merchants).forEach(([id, wallet]) => {
        console.log(`\nMerchant ${id}:`);
        console.log(`  Address:    ${wallet.address}`);
        console.log(`  Private Key: ${wallet.privateKey}`);
        if (wallet.mnemonic) {
            console.log(`  Mnemonic:   ${wallet.mnemonic}`);
        }
    });

    console.log('\n👥 BENEFICIARY WALLETS:');
    console.log('='.repeat(50));
    Object.entries(walletData.beneficiaries).forEach(([id, wallet]) => {
        console.log(`\nBeneficiary ${id}:`);
        console.log(`  Address:    ${wallet.address}`);
        console.log(`  Private Key: ${wallet.privateKey}`);
        if (wallet.mnemonic) {
            console.log(`  Mnemonic:   ${wallet.mnemonic}`);
        }
    });

    console.log(`\n📅 Generated: ${walletData.generatedAt}`);
    console.log('⚠️  Keep these private keys secure!');
}

// Get specific wallet by type and ID
function getWallet(type, id) {
    const walletData = accessWallets();
    if (!walletData) return null;

    const wallet = walletData[type]?.[id];
    if (!wallet) {
        console.log(`❌ Wallet not found: ${type} ${id}`);
        return null;
    }

    return wallet;
}

// Export wallet data to different formats
function exportWallets(format = 'json') {
    const walletData = accessWallets();
    if (!walletData) return;

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');

    switch (format.toLowerCase()) {
        case 'json':
            const jsonPath = path.join(__dirname, '..', `/data/wallets-export-${timestamp}.json`);
            fs.writeFileSync(jsonPath, JSON.stringify(walletData, null, 2));
            console.log(`✅ Wallets exported to: ${jsonPath}`);
            break;

        case 'csv':
            const csvPath = path.join(__dirname, '..', `/data/wallets-export-${timestamp}.csv`);
            let csvContent = 'Type,ID,Address,PrivateKey,Mnemonic\n';

            Object.entries(walletData.merchants).forEach(([id, wallet]) => {
                csvContent += `Merchant,${id},${wallet.address},${wallet.privateKey},"${wallet.mnemonic || ''}"\n`;
            });

            Object.entries(walletData.beneficiaries).forEach(([id, wallet]) => {
                csvContent += `Beneficiary,${id},${wallet.address},${wallet.privateKey},"${wallet.mnemonic || ''}"\n`;
            });

            fs.writeFileSync(csvPath, csvContent);
            console.log(`✅ Wallets exported to: ${csvPath}`);
            break;

        default:
            console.log('❌ Unsupported format. Use "json" or "csv"');
    }
}

// Command line interface
if (require.main === module) {
    const args = process.argv.slice(2);
    const command = args[0];

    switch (command) {
        case 'list':
        case 'show':
            displayAllWallets();
            break;

        case 'get':
            if (args.length < 3) {
                console.log('Usage: node accessWallets.js get <type> <id>');
                console.log('Example: node accessWallets.js get merchants 1');
                break;
            }
            const wallet = getWallet(args[1], args[2]);
            if (wallet) {
                console.log(`\n🔐 Wallet Information:`);
                console.log(`Address:    ${wallet.address}`);
                console.log(`Private Key: ${wallet.privateKey}`);
                if (wallet.mnemonic) {
                    console.log(`Mnemonic:   ${wallet.mnemonic}`);
                }
            }
            break;

        case 'export':
            const format = args[1] || 'json';
            exportWallets(format);
            break;

        default:
            console.log('🔐 Wallet Access Utility');
            console.log('\nUsage:');
            console.log('  node accessWallets.js list          - Show all wallets');
            console.log('  node accessWallets.js get <type> <id> - Get specific wallet');
            console.log('  node accessWallets.js export [format] - Export wallets (json/csv)');
            console.log('\nExamples:');
            console.log('  node accessWallets.js list');
            console.log('  node accessWallets.js get merchants 1');
            console.log('  node accessWallets.js get beneficiaries 2');
            console.log('  node accessWallets.js export json');
            console.log('  node accessWallets.js export csv');
    }
}

module.exports = { accessWallets, displayAllWallets, getWallet, exportWallets };
