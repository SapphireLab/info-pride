import { useEffect, useState } from 'react'
import { showNotification } from '@mantine/notifications'
import { Checkbox, Grid } from '@mantine/core'
import Button from '../components/vendor/Button'
import rfdc from 'rfdc'

import Layout from '../components/Layout'
import { Cards } from '../utils/dataset'
import { Card } from '../utils/wikiPages/cards'

import { idolNameToSlug } from '../data/idols'

const clone = rfdc({
  proto: true,
})

export const LOCALSTORAGE_BOX_TAG = 'localBox'
export type LocalBox = Record<string, boolean[]>

const SettingsPage = () => {
  const [localBox, setLocalBox] = useState<LocalBox>({})

  useEffect(() => {
    try {
      const boxJson = localStorage.getItem(LOCALSTORAGE_BOX_TAG)
      if (boxJson === null) return
      const box = JSON.parse(boxJson)
      setLocalBox(box)
    } catch (_) {
      //
    }
  }, [])

  const updateLocalBox = (slug: string, id: number, have: boolean) => {
    const thisBox = clone(localBox)
    if (!thisBox[slug]) thisBox[slug] = []
    thisBox[slug][id] = have
    setLocalBox(thisBox)
  }

  const saveLocalBox = () => {
    if (!window.localStorage) {
      showNotification({
        title: '浏览器兼容性问题',
        message:
          '此浏览器不支持 localStorage。请升级至更新的浏览器以保存设置。',
        color: 'red',
      })

      return
    }
    localStorage.setItem(LOCALSTORAGE_BOX_TAG, JSON.stringify(localBox))
    showNotification({
      title: '成功',
      message: '你的设置已经保存。',
      color: 'green',
    })
  }

  return (
    <Layout>
      <h2>设置</h2>
      <h3>我的 box</h3>
      <p>在此设置 box 后，搜索时将会显示卡片的持有状态。</p>
      <Grid gutter={20}>
        {Object.entries(Cards).map(([name, _], _key) => (
          <Grid.Col key={_key} xs={12} lg={3} className="rounded">
            <b>{name}</b>
            <div>
              {Object.values(Cards[name as keyof typeof Cards]).map(
                (card: Card, __key) => (
                  <Checkbox
                    key={__key}
                    label={
                      <div className="text-lg">
                        <span>{card.nameCn}</span> <br />
                        <small>{card.nameJa}</small>
                      </div>
                    }
                    checked={Boolean(
                      localBox?.[idolNameToSlug(card.ownerName)!]?.[
                        card.ownerId
                      ]
                    )}
                    onChange={(e) => {
                      updateLocalBox(
                        idolNameToSlug(card.ownerName)!,
                        card.ownerId,
                        e.target.checked
                      )
                    }}
                    className="mt-2"
                  ></Checkbox>
                )
              )}
            </div>
          </Grid.Col>
        ))}
      </Grid>
      <Button variant="outline" onClick={() => saveLocalBox()}>
        保存
      </Button>
    </Layout>
  )
}

export default SettingsPage