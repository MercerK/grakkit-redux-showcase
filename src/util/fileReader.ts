import { record } from '@grakkit/stdlib-paper'

export interface FileInstance {
  file: record
  data: Record<string, any>
  uuid: string
}

type Data = Record<string, any>

const stringifyFormat = (result: Data) => JSON.stringify(result, undefined, 4)

const getPath = (folder: string, fileName: string) => `plugins/grakkit/data/${folder}/${fileName}.json`

export function getFileData(folder: string, fileName: string): FileInstance {
  const path = getPath(folder, fileName)
  const file = core.file(path)

  let data = undefined

  if (!file.exists) {
    file.entry().write(stringifyFormat({}))
  } else {
    let result = file.read()
    data = JSON.parse(result)
  }

  return {
    file,
    data,
    uuid: fileName,
  }
}

export function setFileData<T extends Record<string, any>>(folder: string, fileName: string, result: T) {
  core.file(getPath(folder, fileName)).write(stringifyFormat(result))
}
