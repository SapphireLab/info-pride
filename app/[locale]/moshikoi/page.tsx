import { Grid, GridCol } from '@mantine/core'
import Link from 'next/link'
import { useTranslations } from 'next-intl'

import Title from '#components/Title'
import Paths from '#utils/paths'
import MoshikoiMeta from '#data/moshikoi/meta'

const Page = () => {
    const $t = useTranslations('moshikoi')
    const $vc = useTranslations('v-chr')

    return (
        <>
            <Title title={$t('Moshikoi')} noh2 />
            <h2>
                {$t('Moshikoi')} (<span lang="ja">もし恋</span>)
            </h2>
            <p>{$t('description')}</p>
            <Grid>
                {Object.entries(MoshikoiMeta)
                    .reverse()
                    .map(([key, { title, characterId, startStory, img }]) => (
                        <GridCol
                            span={{ base: 12, md: 6, lg: 4, xl: 3 }}
                            key={key}
                        >
                            <Link
                                href={`/story/${startStory}`}
                                tabIndex={0}
                                className="w-full md:w-[370px]"
                            >
                                <div
                                    className="relative rounded-md"
                                    style={{
                                        aspectRatio: '16 / 9',
                                        backgroundImage: `url(${Paths.assetsImg(
                                            img,
                                        )})`,
                                        backgroundSize: '100% 100%',
                                    }}
                                >
                                    <div className="absolute left-0 right-0 bottom-0 bg-[#eeec] p-2 text-neutral-800">
                                        <b className="text-lg">{title}</b>
                                        <br />
                                        {$vc(characterId)}
                                    </div>
                                </div>
                            </Link>
                        </GridCol>
                    ))}
            </Grid>
        </>
    )
}

export default Page