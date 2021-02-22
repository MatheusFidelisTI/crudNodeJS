const mongoose = require('mongoose')

const PessoaModel = new mongoose.Schema({
  tipo: {
    type: 'String',
    required: true
  },
  nome: {
    type: 'String',
    required: true
  },
  razaoSocial: {
    type: 'String'
  },
  CPF: {
    type: 'String'

  },
  CNPJ: {
    type: 'String'
  },
  sexo: {
    type: 'String'
  },
  dataNascimento: {
    type: 'String'
  },
  email: {
    type: 'String'
  },
  telefone: {
    type: 'String'
  },
  celular: {
    type: 'String'
  },
  foto: {
    type: 'String'
  },
  endereco: [
    {
      endereco: {
        type: 'String',
        required: true
      },
      numero: {
        type: 'Number',
        required: true
      },
      complemento: {
        type: 'String'
      },
      bairro: {
        type: 'String'
      },
      cidade: {
        type: 'String',
        required: true
      },
      estado: {
        type: 'String',
        required: true
      },
      cep: {
        type: 'String'
      }
    }
  ]
})

module.exports = mongoose.model('Pessoa', PessoaModel)
