import { useCallback, useEffect, useRef, useState } from 'react'
import { Grid, NativeSelect } from '@mantine/core'
import { useQuery } from 'react-query'
import spine from '@hoshimei/spine-runtime/spine-canvas'
import { useTranslations } from 'next-intl'

import Paths from '#utils/paths'

const SpineView = ({ id }: { id: string }) => {
    const $t = useTranslations('spine')
    const $c = useTranslations('common')

    const { data: sklJson } = useQuery({
        queryKey: Paths.spine(id + '.skl.json'),
        queryFn: ({ queryKey }) => fetch(queryKey[0]).then((x) => x.json()),
    })

    const [animation, setAnimation] = useState('loop_idle')
    const canvasRef = useRef<HTMLCanvasElement>(null)

    const setupCanvas = useCallback(
        (elem: HTMLCanvasElement, baseName: string) => {
            let lastFrameTime = Date.now() / 1000
            let context: CanvasRenderingContext2D
            let assetManager: spine.canvas.AssetManager
            let skeletonRenderer: spine.canvas.SkeletonRenderer
            let resized = false
            const skinStates: {
                skeleton: spine.Skeleton
                state: spine.AnimationState
            }[] = []

            const animName = animation
            const skinSets = [['shadow'], ['head_FL', 'body_FL']]

            function init() {
                const _ctx = elem.getContext('2d')
                if (!_ctx) {
                    console.log('canvas is not ready!')
                    return
                }
                context = _ctx

                skeletonRenderer = new spine.canvas.SkeletonRenderer(context)
                // enable debug rendering
                skeletonRenderer.debugRendering = false
                // enable the triangle renderer, supports meshes, but may produce artifacts in some browsers
                skeletonRenderer.triangleRendering = true

                assetManager = new spine.canvas.AssetManager(
                    Paths.spineBasePath(baseName)
                )
                assetManager.loadText(baseName + '.skl.json')
                assetManager.loadText(baseName + '.atlas')
                assetManager.loadTexture(baseName + '.png')

                requestAnimationFrame(load)
            }

            function load() {
                if (assetManager.isLoadingComplete()) {
                    for (const skinList of skinSets) {
                        skinStates.push(
                            loadSkeleton(baseName, animName, skinList)
                        )
                    }
                    requestAnimationFrame(render)
                } else {
                    requestAnimationFrame(load)
                }
            }

            function loadSkeleton(
                name: string,
                initialAnimation: string,
                skins: string[]
            ) {
                // Load the texture atlas using name.atlas and name.png from the AssetManager.
                // The function passed to TextureAtlas is used to resolve relative paths.
                const atlas = new spine.TextureAtlas(
                    assetManager.get(baseName + '.atlas'),
                    function (path) {
                        return assetManager.get(path)
                    }
                )

                // Create a AtlasAttachmentLoader, which is specific to the WebGL backend.
                const atlasLoader = new spine.AtlasAttachmentLoader(atlas)

                // Create a SkeletonJson instance for parsing the .json file.
                const skeletonJson = new spine.SkeletonJson(atlasLoader)

                // Set the scale to apply during parsing, parse the file, and create a new skeleton.
                const skeletonData = skeletonJson.readSkeletonData(
                    assetManager.get(name + '.skl.json')
                )
                const skeleton = new spine.Skeleton(skeletonData)
                // skeleton.bones = skeleton.bones.filter()
                skeleton.scaleY = -1
                const combinedSkin = new spine.Skin('combined-skin')
                for (const skinName of skins) {
                    combinedSkin.addSkin(skeletonData.findSkin(skinName))
                }
                skeleton.setSkin(combinedSkin)
                skeleton.setSlotsToSetupPose()

                // Create an AnimationState, and set the initial animation in looping mode.
                const animationState = new spine.AnimationState(
                    new spine.AnimationStateData(skeleton.data)
                )
                animationState.setAnimation(0, initialAnimation, true)

                // Pack everything up and return to caller.
                return {
                    skeleton: skeleton,
                    state: animationState,
                }
            }

            function render() {
                const now = Date.now() / 1000
                const delta = now - lastFrameTime
                lastFrameTime = now

                if (!resized) resize()

                context.save()
                context.setTransform(1, 0, 0, 1, 0, 0)
                context.fillStyle = '#cccccc'
                context.fillRect(0, 0, elem.width, elem.height)
                context.restore()

                for (const { state, skeleton } of Object.values(skinStates)) {
                    state.update(delta)
                    state.apply(skeleton)
                    skeleton.updateWorldTransform()
                    skeletonRenderer.draw(skeleton)
                }

                requestAnimationFrame(render)
            }

            function resize() {
                const w = elem.clientWidth
                const h = elem.clientHeight
                if (elem.width != w || elem.height != h) {
                    elem.width = w
                    elem.height = h
                }
                context.setTransform(1, 0, 0, 1, 0, 0)
                context.translate(elem.width / 2, elem.height / 2)
                // TODO: fix a value
                context.translate(0, 150)
                resized = true
            }

            init()
        },
        [animation]
    )

    useEffect(() => {
        const cur = canvasRef.current
        if (!cur) return
        setupCanvas(cur, id)
    }, [canvasRef, id, setupCanvas])

    return (
        <Grid>
            <Grid.Col md={12} lg={8}>
                {sklJson ? (
                    <NativeSelect
                        data={Object.keys(
                            (sklJson as Record<string, any>).animations
                        )}
                        value={animation}
                        onChange={(event) =>
                            setAnimation(event.currentTarget.value)
                        }
                        label={$t('Select the animation')}
                        withAsterisk
                    />
                ) : (
                    <p>{$c('loading')}</p>
                )}
            </Grid.Col>
            <Grid.Col md={12} lg={4}>
                <canvas
                    className="mx-auto block"
                    height="400"
                    width="220"
                    ref={canvasRef}
                />
            </Grid.Col>
        </Grid>
    )
}

export default SpineView
