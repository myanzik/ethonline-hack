# Wallet Generation & Access Scripts

These scripts generate and access random Ethereum wallets for merchants and beneficiaries in the admin dashboard.

## Usage

### Generate Wallets
```bash
npm run generate-wallets
```

Or run directly:
```bash
node scripts/generateWallets.js
```

### Access Wallet Information (including private keys)
```bash
# Show all wallets with private keys
npm run show-wallets

# Get specific wallet
node scripts/accessWallets.js get merchants 1
node scripts/accessWallets.js get beneficiaries 2

# Export wallets to file
npm run export-wallets
node scripts/accessWallets.js export csv
```

## What it does

1. **Generates Wallets**: Creates random Ethereum wallets using ethers.js for:
   - 5 merchants
   - 6 beneficiaries

2. **Saves Data**: Creates two files:
   - `data/wallets.json` - Complete wallet data (addresses, private keys, mnemonics)
   - `src/data/walletAddresses.ts` - TypeScript constants with just the addresses

3. **Updates Mock Data**: The mock data automatically uses the generated wallet addresses

## Files Created

- `data/wallets.json` - Full wallet data (gitignored for security)
- `src/data/walletAddresses.ts` - Public wallet addresses for the app

## Security Note

⚠️ **Important**: The generated wallets are for development/demo purposes only. The `data/wallets.json` file contains private keys and is automatically gitignored. Never use these wallets with real funds or in production.

## Accessing Private Keys

The private keys are stored in `data/wallets.json` and can be accessed using:

```bash
# View all wallets with private keys
npm run show-wallets

# Get specific wallet information
node scripts/accessWallets.js get merchants 1
node scripts/accessWallets.js get beneficiaries 2

# Export to different formats
npm run export-wallets          # JSON format
node scripts/accessWallets.js export csv  # CSV format
```

## Regenerating Wallets

To generate new wallets, simply run the script again. It will overwrite the existing wallet data with new random wallets.
