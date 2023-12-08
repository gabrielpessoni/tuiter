const Tuit = require('../models/Tuit')
const User = require('../models/User')

module.exports = class TuiterController {

    static async showTuits(req, res) {
        const tuitsData = await Tuit.findAll({
            include: User,
        })
        const tuits = tuitsData.map((result) => result.get({plain: true}));

        res.render('tuits/home', {tuits})
    }

    static async dashboard(req, res) {
        // Obtenha o ID do usuário da sessão
        const userId = req.session.userId;

        // Verifique se userId está definido
        if (!userId) {
            res.redirect('/login');
            return;
        }

        try {
            // Tente encontrar o usuário pelo ID
            const user = await User.findOne({
                where: {
                    id: userId,
                },
                include: Tuit,
            });

            // Verifique se o usuário foi encontrado
            if (!user) {
                res.redirect('/login');
                return;
            }

            // Obtenha os tuítes do usuário
            const tuits = user.Tuits.map((result) => result.dataValues);
            let emptyTuits = false

            if (tuits.length === 0) {
                emptyTuits = true
            }

            res.render('tuits/dashboard', { tuits, emptyTuits });
        } catch (error) {
            console.error('Erro ao buscar usuário:', error);
            res.status(500).send('Erro interno do servidor');
        }
    }

    static createTuit(req, res) {
        res.render('tuits/create')
    }

    static async createTuitSave(req, res) {

        const tuit = {
            title: req.body.title,
            UserId: req.session.userId,
        }

        console.log("session", req.session);

        try {
            await Tuit.create(tuit)
            req.flash('message', 'Tuit criado com sucesso!')

            req.session.save(() => {
                res.redirect('/tuits/dashboard')
            })
        } catch (err) {
            console.log('Aconteceu algum erro', err)
        }
    }

    static async removeTuit(req, res) {
        const id = req.body.id
        const UserId = req.session.userId;

        try {
            await Tuit.destroy({ where: { id: id, UserId: UserId } })

            req.flash('message', 'Tuit deletado com sucesso!')

            req.session.save(() => {
                res.redirect('/tuits/dashboard')
            })

        } catch (err) {
            console.log('Aconteceu algum erro: ' + err)
        }
    }

    static async updateTuit(req, res) {
        const id = req.params.id

        const tuit = await Tuit.findOne({ where: { id: id }, raw: true })

        res.render('tuits/edit', { tuit })
    }

    static async updateTuitSave(req, res) {
        const id = req.body.id

        const tuit = {
            title: req.body.title,
        }

        try {
            await Tuit.update(tuit, { where: { id: id } })

            req.flash('message', 'Tuit atualizado com sucesso!')

            req.session.save(() => {
                res.redirect('/tuits/dashboard')
            })

        } catch (error) {
            console.log('Aconteceu algum erro', error)
        }

    }

}