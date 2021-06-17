const { db, dbQuery } = require('../config/database')

module.exports = {
    getMovies: async (req, res, next) => {
        try {
            let dataSearch = [], getSQL
            for (let prop in req.query) {
                dataSearch.push(`${prop} = ${db.escape(req.query[prop])}`)
            }
            if (dataSearch.length > 0) {
                getSQL = `Select m.name, m.release_date, m.release_month, m.release_year, m.duration_min, m.genre, m.description, ms.status, l.location, sh.time from movies m join movie_status ms
                on m.status = ms.id join schedules sc on sc.movie_id = m.id join locations l on l.id = sc.location_id join show_times sh on sh.id = sc.time_id where ${dataSearch.join(' AND ')};`
            } else {
                getSQL = `Select m.name, m.release_date, m.release_month, m.release_year, m.duration_min, m.genre, m.description, ms.status, l.location, sh.time from movies m join movie_status ms
                on m.status = ms.id join schedules sc on sc.movie_id = m.id join locations l on l.id = sc.location_id join show_times sh on sh.id = sc.time_id;`
            }
            let get = await dbQuery(getSQL)
            res.status(200).send(get)
        } catch (error) {
            next(error)
        }
    },
    addMovies: async (req, res, next) => {
        try {
            console.log("CEK ROLE", req.user.role)
            if (req.user.role == 1) {
                let addSQL = `insert into movies (name, release_date, release_month, release_year, duration_min, genre, description)
                values (${db.escape(req.body.name)}, ${db.escape(req.body.release_date)}, ${db.escape(req.body.release_month)}, ${db.escape(req.body.release_year)},
                ${db.escape(req.body.duration_min)}, ${db.escape(req.body.genre)}, ${db.escape(req.body.description)})`
                addSQL = await dbQuery(addSQL)
                if (addSQL.insertId) {
                    let get = `Select * from movies where id = ${addSQL.insertId}`
                    get = await dbQuery(get)
                    res.status(200).send(get)

                }
            } else {
                res.status(500).send("You can't complete this action, you are not Admin")
            }
        } catch (error) {
            next(error)
        }
    },
    editMovies: async (req, res, next) => {
        try {
            if(req.user.role === 1) {
                let update = `Update movies set status = ${req.body.status} where id = ${req.params.id};`
                update = await dbQuery(update)
                res.status(200).send({id: req.params.id, message: 'Status has been changed!'})
            } else {
                res.status(500).send("You can't complete this action, you are not Admin")
            }
        } catch (error) {
            next(error)
        }
    },
    addSchedule: async (req, res, next) => {
        try {
            if(req.user.role === 1) {
                let addSc = `Insert into schedules (movie_id, location_id, time_id)
                values (${req.params.id}, ${req.body.location_id}, ${req.body.time_id});`
                addSc = await dbQuery(addSc)
                res.status(200).send({id: req.params.id, message: 'Schedule has been added!'})
            } else {
                res.status(500).send("You can't complete this action, you are not Admin")
            }
        } catch (error) {
            next(error)
        }
    }
}