import { useState } from 'react'
import dynamic from 'next/dynamic'
import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'

import _range from 'lodash/range'
import Grid from '@mui/material/Grid'

import { Notemap } from '../utils/dataset'

const NotemapGraph = dynamic(() => import('../components/NotemapGraph'), {
  ssr: false,
})

const NotemapPage = () => {
  const songList = Object.keys(Notemap)
  const [song, setSong] = useState<string>(songList[0])
  const notemapList = song !== undefined ? Object.keys(Notemap[song]) : []
  const [notemap, setNotemap] = useState<string>(notemapList[0])
  const selectedNotemap = song && notemap ? Notemap[song][notemap] : undefined

  return (
    <Container
      sx={{
        marginTop: '2rem',
      }}
    >
      <Typography variant="h2">谱面</Typography>
      <Grid
        container
        spacing={2}
        sx={{
          marginTop: '1rem',
          marginBottom: '1rem',
        }}
      >
        <Grid item xs={12} lg={6}>
          <FormControl fullWidth>
            <InputLabel id="lSong">曲目</InputLabel>
            <Select
              labelId="lSong"
              value={song}
              label="系列"
              onChange={(i) => {
                setSong(i.target.value)
                setNotemap('')
              }}
            >
              <MenuItem value=""></MenuItem>
              {songList.map((item, key) => (
                <MenuItem key={key} value={item}>
                  {item}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel id="lNotemap">谱面</InputLabel>
            <Select
              labelId="lNotemap"
              value={notemap}
              label="谱面"
              onChange={(i) => {
                setNotemap(i.target.value)
              }}
            >
              <MenuItem value=""></MenuItem>
              {notemapList.map((item, key) => (
                <MenuItem key={key} value={item}>
                  {item}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} lg={6}>
          {selectedNotemap !== undefined && (
            <NotemapGraph notemap={selectedNotemap} />
          )}
        </Grid>
      </Grid>
    </Container>
  )
}

export default NotemapPage