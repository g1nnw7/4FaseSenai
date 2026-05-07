const bcrypt = require('bcrypt');
const db = require('./src/config/db'); 

const seedAdmin = async () => {
    try {
        console.log('🌱 Iniciando o seed...');
        const salt = await bcrypt.genSalt(10);
        const senhaCriptografada = await bcrypt.hash('admin123', salt);
        const query = `
            INSERT INTO usuarios (nome, email, senha, role) 
            VALUES ($1, $2, $3, $4)
            ON CONFLICT (email) DO NOTHING
            RETURNING id;
        `;
        
        const values = [
            'Administrador do Sistema', 
            'admin@admin.com', 
            senhaCriptografada, 
            'ADMIN'
        ];

        const { rowCount } = await db.query(query, values);

        if (rowCount > 0) {
            console.log('✅ Usuário Administrador criado com sucesso!');
            console.log('👉 Email: admin@admin.com');
            console.log('👉 Senha: admin123');
        } else {
            console.log('⚠️ O usuário Administrador já existe no banco de dados.');
        }

    } catch (error) {
        console.error('❌ Erro ao rodar o seed:', error);
    } finally {
        process.exit();
    }
};

seedAdmin();