const { db, dbQuery, createToken } = require('../config')

module.exports = {
    register: async (req, res, next) => {
        try {
            if (req.body.username.length >= 6 && req.body.email.includes('@') && req.body.password.length >= 6 && req.body.password.match(/[a-z]/ig) && req.body.password.match(/[0-9]/ig) && req.body.password.match(/[!@#$%^&*()_+/-=~\\:';{}"\[\]|,.?<>\/]/ig)) {
                let id0 = Date.now()
                let id1 = id0.toString()
                let userId = parseInt(id1.slice(0, 8))
                console.log(userId)
                let insertSQL = `Insert into users (uid, username, email, password) 
                values (${userId}, ${db.escape(req.body.username)}, ${db.escape(req.body.email)}, ${db.escape(req.body.password)});`
                let regis = await dbQuery(insertSQL)
                let getUser = await dbQuery(`Select * from users where id = ${regis.insertId}`)
                let { id, uid, username, email, password, role, status } = getUser[0]

                //TOKEN
                let token = createToken({ id, uid, username, email, password, role, status })

                res.status(201).send({ id, uid, username, email, token })
            } else {
                res.status(500).send("Email and Password Invalid")
            }
        } catch (error) {
            next(error)
        }
    },
    login: async (req, res, next) => {
        try {
            if (req.body.email && req.body.password) {
                let loginSQL = `Select u.*, s.status from users u join status s on u.status = s.id
                where email = ${db.escape(req.body.email)} and password = ${db.escape(req.body.password)};`
                loginSQL = await dbQuery(loginSQL)

                let getUser = await dbQuery(`Select * from users where id = ${loginSQL[0].id}`)
                let { id, uid, username, email, password, role, status } = getUser[0]

                //TOKEN
                let token = createToken({ id, uid, username, email, password, role, status })

                if (status == 2 || status == 3) {
                    res.status(404).send("Account Not Available")
                    console.log({ id, uid, username, email, role, status, token })

                } else {
                    res.status(200).send({ id, uid, username, email, role, status, token })
                }

            }
        } catch (error) {
            next(error)
        }
    },
    deactive: async (req, res, next) => {
        try {
            if (req.user) {
                console.log("CEK USER", req.user)

                let deact = `Update users set status = 2 where id = ${req.user.id};`
                deact = await dbQuery(deact)
                let getUser = await dbQuery(`Select u.id, u.uid, u.username, u.email, u.password, u.role, s.status from users u join status s on u.status = s.id where u.id = ${req.user.id}`)
                let { id, uid, username, email, password, role, status } = getUser[0]
                let token = createToken({ id, uid, username, email, password, role, status })
                res.status(200).send({ uid, status, token})
            } else {
                res.status(500).send("You can't complete this action, your token invalid")
            }
        } catch (error) {
            next(error)
        }
    },
    activate: async (req, res, next) => {
        try {
            console.log("CEK USER", req.user)
            console.log("STATUS", req.user.status)
            if (req.user.status !== 'active' && req.user.status !== 'closed') {
                let active = `Update users set status = 1 where id = ${req.user.id};`
                active = await dbQuery(active)
                let getUser = await dbQuery(`Select u.id, u.uid, u.username, u.email, u.password, u.role, s.status from users u join status s on u.status = s.id where u.id = ${req.user.id}`)

                let { id, uid, username, email, password, role, status } = getUser[0]
                let token = createToken({ id, uid, username, email, password, role, status })
                res.status(200).send({ uid, status, token })
            } else {
                res.status(500).send("You can't complete this action, your account are active or closed")
            }
        } catch (error) {
            next(error)
        }
    },
    closed: async (req, res, next) => {
        try {
            if (req.user) {
                console.log("CEK USER", req.user)

                let close = `Update users set status = 3 where id = ${req.user.id};`
                close = await dbQuery(close)
                let getUser = await dbQuery(`Select u.id, u.uid, u.username, u.email, u.password, u.role, s.status from users u join status s on u.status = s.id where u.id = ${req.user.id}`)
                let { id, uid, username, email, password, role, status } = getUser[0]
                let token = createToken({ id, uid, username, email, password, role, status })
                res.status(200).send({ uid, status, token })
            } else {
                res.status(500).send("You can't complete this action, your token invalid")
            }
        } catch (error) {
            next(error)
        }
    }
}