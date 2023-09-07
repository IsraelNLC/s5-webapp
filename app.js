const mysql = require('mysql');
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const dbConfig = {
  host: 'db-mysql-atv.cxytfsgp15kf.us-east-1.rds.amazonaws.com',
  user: 'admin',
  password: 'password',
  database: 'db_mysql_atv',
  port: '3306'
};

class App {
    constructor() {
      this.express = express();
      this.middlewares();
      this.routes();
    }
  
    middlewares() {
      this.express.use(express.json());
      this.express.use(bodyParser.urlencoded({ extended: true }));
      this.express.set('view engine', 'ejs');
      this.express.set('views', path.join(__dirname, 'views'));
    }
  
    routes() {
      this.express.get('/', (req, res) => {
        const connection = mysql.createConnection(dbConfig);

        const query = 'SELECT * FROM usuarios';

        connection.query(query, (error, results) => {
          if (error) {
            console.error('Erro ao realizar consulta: ', error);
            res.status(500).json({ error: 'Erro ao realizar consulta' });
            return;
          }
          const usuarios = results;
          connection.end();
          console.log(usuarios)
          res.render('index', { usuarios });
        });
      });

      this.express.get('/list', (req, res) => {
        const connection = mysql.createConnection(dbConfig);

        const query = 'SELECT * FROM usuarios';

        connection.query(query, (error, results) => {
          if (error) {
            console.error('Erro ao realizar consulta: ', error);
            res.status(500).json({ error: 'Erro ao realizar consulta' });
            return;
          }
          res.json(results);
          
          connection.end();
        });
      });

      this.express.post('/addUser', (req, res) => {
        const connection = mysql.createConnection(dbConfig);

        console.log(req.body.nome, req.body.email)

        const query = `
          INSERT INTO usuarios (nome, email, data_acesso)
          VALUES ('${req.body.nome}', '${req.body.email}', NOW());
        `;

        connection.query(query, (error, results) => {
          if (error) {
            console.error('Erro ao inserir usuário: ', error);
            res.status(500).json({ error: 'Erro ao inserir usuário' });
            return;
          }          
          connection.end();
          res.redirect('/');
        });
      });

      this.express.get('/deleteUsers', (req, res) => {
        const connection = mysql.createConnection(dbConfig);

        const query = 'DELETE FROM usuarios';

        connection.query(query, (error, results) => {
          if (error) {
            console.error('Erro ao deletar usuários: ', error);
            res.status(500).json({ error: 'Erro ao deletar usuários' });
            return;
          }
          res.json(results);
          
          connection.end();
        });
      });

      this.express.get('/createTable', (req, res) => {
        const connection = mysql.createConnection(dbConfig);
        
        const query = `
        CREATE TABLE usuarios (
          id INT PRIMARY KEY AUTO_INCREMENT,
          nome VARCHAR(255),
          email VARCHAR(255) UNIQUE,
          data_acesso DATE
        );
      `;
        
        connection.query(query, (error, results) => {
          if (error) {
            console.error('Erro ao criar tabela: ', error);
            res.status(500).json({ error: 'Erro ao criar tabela' });
            return;
          }
          res.json(results);
          
          connection.end();
        });
      });

      this.express.get('/secret', (req, res) => {
        res.render('secret');
      });
      
    }

  }
  
const app = new App().express;
app.listen(3000, () => console.log('Servidor executando na porta 3000'));