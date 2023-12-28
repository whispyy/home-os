
export interface Download {
  name: string
  percentage: number
}

type Source = [string, number, string, number, number]

export const transformer = (input: {
  torrents: Source[]
}): Download[] => {
  return input.torrents.map(torrent => ({
    name: torrent[2],
    percentage: torrent[4]
  }))
}