
//Carregando módulos
    const express = require("express")
    const handlebars = require("express-handlebars")
    const bodyparser = require("body-parser")
    const app = express()
    const admin = require("./routes/admin")
    const path = require("path")
    const mongoose = require("mongoose")
    const session = require("express-session")
    const flash = require("connect-flash")
    const usuarios = require("./routes/usuario")
    const passport = require("passport")
    require("./config/auth")(passport)


//Configurações
    //Configurando a sessão
    app.use(session({
        secret: "cursonode",
        resave: true,
        saveUninitialized: true
    }))

    //Passport
    app.use(passport.initialize())
    app.use(passport.session())

    //Flash
    app.use(flash())

    //Middleware
    app.use((req, res, next) =>{
        res.locals.success_msg = req.flash("success_msg")
        res.locals.error_msg = req.flash("error_msg")
        res.locals.error = req.flash("error")
        res.locals.user = req.user || null;
        next()
    })

    //Configurando o BodyParser
    app.use(bodyparser.urlencoded({extended: true}))
    app.use(bodyparser.json())

    //Configurando o Handlebars
    app.engine('handlebars', handlebars({defaultLayout: 'main'}))
    app.set('view engine', 'handlebars')

    //Configurando o Mongoose
    mongoose.Promise = global.Promise;
    mongoose.connect("mongodb://localhost/blogapp").then(() =>{
        console.log("Conectado ao MongoDB!!!")
    }).catch((erro) => {
        console.log("Houve um erro!!! "+erro)
    })

    //PUBLIC - Arquivos estáticos
    app.use(express.static(path.join(__dirname, "public")))

    app.use((req, res, next) => {
        console.log("alo sou um middleware")
        next();

    })

    //Configurando gerais

//Rotas
    app.use('/', admin)
    app.use("/usuarios", usuarios)

//Outros
const PORT = 8081
app.listen(PORT, () => {
    console.log("Servidor rodando!!!")
})