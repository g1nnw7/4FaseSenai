import 'dotenv/config'; 
import pkg from 'pg';
import bcrypt from 'bcrypt';

const { Client } = pkg;

async function popularBanco() {
    console.log('🌱 Iniciando o seed do banco de dados...');

    const client = new Client({
        connectionString: process.env.DATABASE_URL,
    });

    try {
        await client.connect();

        // --- 1. Criar Usuário Admin ---
        const senhaHash = await bcrypt.hash('admin123', 10);
        const queryAdmin = `
            INSERT INTO usuarios (nome, email, senha, role)
            VALUES ($1, $2, $3, $4)
            ON CONFLICT (email) DO NOTHING;
        `;
        await client.query(queryAdmin, ['Administrador Master', 'admin@rappa.com', senhaHash, 'ADMIN']);
        console.log('✅ Verificação de Admin concluída.');

        // --- 2. Lista de Produtos Apple (30 itens) ---
        const produtosApple = [
            { nome: 'iPhone 15 Pro Max', cat: 'Smartphone', sku: 'APL-I15PM-256', status: 'Ativo', est: 15, preco: 9499.00 },
            { nome: 'iPhone 15', cat: 'Smartphone', sku: 'APL-I15-128', status: 'Ativo', est: 25, preco: 7299.00 },
            { nome: 'iPhone 14', cat: 'Smartphone', sku: 'APL-I14-128', status: 'Rascunho', est: 10, preco: 5999.00 },
            { nome: 'iPhone 13', cat: 'Smartphone', sku: 'APL-I13-128', status: 'Esgotado', est: 0, preco: 4599.00 },
            { nome: 'MacBook Air M2', cat: 'Notebook', sku: 'APL-MBA-M2', status: 'Ativo', est: 8, preco: 11599.00 },
            { nome: 'MacBook Pro M3 Max', cat: 'Notebook', sku: 'APL-MBP-M3X', status: 'Ativo', est: 5, preco: 34999.00 },
            { nome: 'iPad Air 5ª Ger', cat: 'Tablet', sku: 'APL-IPA-5', status: 'Ativo', est: 12, preco: 6999.00 },
            { nome: 'iPad Pro M2', cat: 'Tablet', sku: 'APL-IPP-M2', status: 'Rascunho', est: 7, preco: 12499.00 },
            { nome: 'Apple Watch Series 9', cat: 'Wearable', sku: 'APL-W9-45', status: 'Ativo', est: 20, preco: 4299.00 },
            { nome: 'Apple Watch Ultra 2', cat: 'Wearable', sku: 'APL-WULTRA-2', status: 'Ativo', est: 10, preco: 9699.00 },
            { nome: 'AirPods Pro 2', cat: 'Acessório', sku: 'APL-AIRP2', status: 'Ativo', est: 50, preco: 2599.00 },
            { nome: 'AirPods Max', cat: 'Acessório', sku: 'APL-AIRMAX', status: 'Esgotado', est: 0, preco: 6590.00 },
            { nome: 'iMac 24" M3', cat: 'Desktop', sku: 'APL-IMAC-M3', status: 'Ativo', est: 4, preco: 14499.00 },
            { nome: 'Mac Mini M2', cat: 'Desktop', sku: 'APL-MM-M2', status: 'Rascunho', est: 6, preco: 7499.00 },
            { nome: 'Mac Studio M2 Ultra', cat: 'Desktop', sku: 'APL-MS-M2U', status: 'Ativo', est: 2, preco: 45999.00 },
            { nome: 'Apple TV 4K', cat: 'Acessório', sku: 'APL-TV4K', status: 'Ativo', est: 15, preco: 1499.00 },
            { nome: 'Magic Mouse', cat: 'Acessório', sku: 'APL-MMOUSE', status: 'Ativo', est: 30, preco: 820.00 },
            { nome: 'Magic Keyboard', cat: 'Acessório', sku: 'APL-MKEYB', status: 'Ativo', est: 20, preco: 1200.00 },
            { nome: 'Studio Display', cat: 'Monitor', sku: 'APL-SDISP', status: 'Rascunho', est: 3, preco: 16599.00 },
            { nome: 'Pro Display XDR', cat: 'Monitor', sku: 'APL-PXDR', status: 'Ativo', est: 1, preco: 44999.00 },
            { nome: 'Carregador MagSafe', cat: 'Acessório', sku: 'APL-MSAFE', status: 'Ativo', est: 100, preco: 499.00 },
            { nome: 'Cabo USB-C (2m)', cat: 'Acessório', sku: 'APL-USBC2M', status: 'Ativo', est: 200, preco: 299.00 },
            { nome: 'iPad Mini 6ª Ger', cat: 'Tablet', sku: 'APL-IPM-6', status: 'Esgotado', est: 0, preco: 5999.00 },
            { nome: 'AirTag (4 unidades)', cat: 'Acessório', sku: 'APL-AIRTAG4', status: 'Ativo', est: 40, preco: 1249.00 },
            { nome: 'HomePod 2ª Ger', cat: 'Acessório', sku: 'APL-HPOD-2', status: 'Ativo', est: 10, preco: 2999.00 },
            { nome: 'HomePod Mini', cat: 'Acessório', sku: 'APL-HPMINI', status: 'Ativo', est: 18, preco: 1099.00 },
            { nome: 'Apple Pencil 2', cat: 'Acessório', sku: 'APL-PENCIL2', status: 'Ativo', est: 25, preco: 1199.00 },
            { nome: 'Smart Folio iPad', cat: 'Acessório', sku: 'APL-FOLIO', status: 'Ativo', est: 15, preco: 799.00 },
            { nome: 'MacBook Air M1', cat: 'Notebook', sku: 'APL-MBA-M1', status: 'Esgotado', est: 0, preco: 7999.00 },
            { nome: 'iPhone SE 2022', cat: 'Smartphone', sku: 'APL-ISE-2022', status: 'Ativo', est: 14, preco: 4299.00 }
        ];

        console.log('📦 Inserindo produtos...');

        const queryProduto = `
            INSERT INTO produtos (nome, categoria, sku, status, estoque, preco)
            VALUES ($1, $2, $3, $4, $5, $6)
            ON CONFLICT (sku) DO NOTHING;
        `;

        for (const p of produtosApple) {
            await client.query(queryProduto, [p.nome, p.cat, p.sku, p.status, p.est, p.preco]);
        }

        console.log(`✅ ${produtosApple.length} produtos processados!`);

    } catch (error) {
        console.error('❌ Erro ao rodar o seed:', error);
    } finally {
        await client.end();
        console.log('🔌 Conexão encerrada.');
    }
}

popularBanco();