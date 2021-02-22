const Pessoa = require('../models/pessoaModel')
const Router = require('express').Router()
const { check, validationResult } = require('express-validator')

const ValidacaoPost = [check('nome').not().isEmpty().withMessage('Precisa ser pelo menos 5 caracteres.'),
  check('tipo').custom(async (val, { req }) => {
    if (val === 'Pessoa física') {
      if (req.body.CPF.match('^[0-9]{3}.[0-9]{3}.[0-9]{3}-[0-9]{2}$')) {
        if (await Pessoa.exists({ CPF: req.body.CPF }) && !req.params.idPessoa) {
          throw new Error('O CPF Informado ja esta cadastrado')
        } else {
          const tipoSexo = ['Masculino', 'Feminino', 'Outro']
          if (tipoSexo.includes(req.body.sexo)) {
            if (req.body.dataNascimento.match('^[0-9]{2}/[0-9]{2}/[0-9]{4}$')) {
              return true
            } else {
              throw new Error('Precisa ser informado a data de nascimento. Ex: 00/00/0000')
            }
          } else {
            throw new Error('Precisa ser informado o sexo. Ex: Feminino, Masculino, Outro ')
          }
        }
      } else {
        throw new Error('Formato do CPF incorreto. EX: 000.000.000-00')
      }
    } else if (val === 'Pessoa jurídica') {
      if (req.body.CNPJ.match('^[0-9]{2}.[0-9]{3}.[0-9]{3}/[0-9]{4}-[0-9]{2}$')) {
        if (await Pessoa.exists({ CNPJ: req.body.CNPJ }) && !req.params.idPessoa) {
          throw new Error('O CNPJ Informado ja esta cadastrado')
        } else {
          return true
        }
      } else {
        throw new Error('Formato do CNPJ incorreto. EX: 00.000.000/0000-00')
      }
    } else {
      return false
    }
  }).withMessage('Precisa ser informado o tipo. Ex: Pessoa física ou Pessoa jurídica '),
  check('endereco.*.endereco').not().isEmpty().withMessage('O Endereço nao pode ser em branco '),
  check('endereco.*.numero').not().isEmpty().withMessage('O Numero nao pode ser em branco '),
  check('endereco.*.cidade').not().isEmpty().withMessage('O Cidade nao pode ser em branco '),
  check('endereco.*.estado').not().isEmpty().withMessage('O Estado nao pode ser em branco '),
  check('endereco.*.cep').not().isEmpty().withMessage('O CEP nao pode ser em branco ')

]

Router.get('/api', async (req, res) => {
  const pessoaGetAll = await Pessoa.find({})
  res.json(pessoaGetAll)
  res.status(201)
})

Router.post('/api', ValidacaoPost, async (req, res) => {
  const returnErros = validationResult(req)

  if (returnErros.errors.length > 0) {
    res.status(400).json(returnErros)
  } else {
    const pessoaJson = req.body

    const newPessoa = new Pessoa(pessoaJson)
    const rest = await newPessoa.save()
    res.status(201).json(rest)
  }
})

Router.post('/api/:idPessoa', ValidacaoPost, async (req, res) => {
  const returnErros = validationResult(req)

  if (returnErros.errors.length > 0) {
    res.status(400).json(returnErros)
  } else {
    const { idPessoa } = req.params
    const { body } = req

    await Pessoa.findByIdAndUpdate({ _id: idPessoa }, body, { new: true, overwrite: true }, (err, Customer) => {
      if (!err && Customer) {
        console.log(Customer)
        res.json({ message: 'Atualizada com sucesso!' })
      } else {
        res.json({ error: 'id ' + idPessoa + ' não encontrada!' })
      }
    })
  }
})

Router.delete('/api/:idPessoa', async (req, res) => {
  const { idPessoa } = req.params

  await Pessoa.findOneAndDelete({ _id: idPessoa }, (err, Customer) => {
    if (!err && Customer) {
      console.log(Customer)
      res.json({ message: 'Deletado com sucesso!' })
    } else {
      res.json({ error: 'id ' + idPessoa + ' não encontrada!' })
    }
  })
})

module.exports = Router
