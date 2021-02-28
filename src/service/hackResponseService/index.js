import config from '../../config'
import handlers from './handlers'

const handle = (response, hackData) => {
  const hackResponse = setUpHandlers(hackData)
  returnResponse(response, hackResponse)
}

const setUpHandlers = (hackResponse) => {
  const responseWithHandlers = hackResponse.map((item) => {
    item.handle = typeof handlers[item.type] === 'function' ? handlers[item.type] : handlers[config.defaultHandler]
    return item
  })
  return responseWithHandlers
}

const returnResponse = (response, hackResponse) => {
  response.setHeader('Content-Type', 'text/html; charset=utf-8')
  response.setHeader('Transfer-Encoding', 'chunked')

  for (const command of hackResponse) {
    try {
      command.handle(response, command.value)
    } catch (e) { }
  }

  response.end()
}

export default {
  handle
}
