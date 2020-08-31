import express from 'express'

import serverInitialisation from './setup/server-initialisation'
import startServer from './setup/start-server'

const server = express()

serverInitialisation(server)

startServer(server)