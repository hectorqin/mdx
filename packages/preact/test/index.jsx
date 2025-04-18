/* @jsxRuntime automatic */
/* @jsxImportSource preact */

/**
 * @import {ComponentProps} from 'preact'
 */

import assert from 'node:assert/strict'
import {test} from 'node:test'
import {evaluate} from '@mdx-js/mdx'
import {MDXProvider, useMDXComponents} from '@mdx-js/preact'
import * as runtime from 'preact/jsx-runtime'
import {render} from 'preact-render-to-string'

test('@mdx-js/preact', async function (t) {
  await t.test('should expose the public api', async function () {
    assert.deepEqual(Object.keys(await import('@mdx-js/preact')).sort(), [
      'MDXProvider',
      'useMDXComponents'
    ])
  })

  await t.test(
    'should support `components` with `MDXProvider`',
    async function () {
      const {default: Content} = await evaluate('# hi', {
        ...runtime,
        useMDXComponents
      })

      assert.equal(
        render(
          <MDXProvider
            components={{
              h1(properties) {
                return <h1 style={{color: 'tomato'}} {...properties} />
              }
            }}
          >
            <Content />
          </MDXProvider>
        ),
        '<h1 style="color:tomato;">hi</h1>'
      )
    }
  )

  await t.test('should support `wrapper` in `components`', async function () {
    const {default: Content} = await evaluate('# hi', {
      ...runtime,
      useMDXComponents
    })

    assert.equal(
      render(
        <MDXProvider
          components={{
            /**
             * @param {ComponentProps<'div'>} properties
             *   Properties.
             * @returns
             *   Element.
             */
            wrapper(properties) {
              return <div id="layout" {...properties} />
            }
          }}
        >
          <Content />
        </MDXProvider>
      ),
      '<div id="layout"><h1>hi</h1></div>'
    )
  })

  await t.test(
    'should combine components in nested `MDXProvider`s',
    async function () {
      const {default: Content} = await evaluate('# hi\n## hello', {
        ...runtime,
        useMDXComponents
      })

      assert.equal(
        render(
          <MDXProvider
            components={{
              h1(properties) {
                return <h1 style={{color: 'tomato'}} {...properties} />
              },
              h2(properties) {
                return <h2 style={{color: 'rebeccapurple'}} {...properties} />
              }
            }}
          >
            <MDXProvider
              components={{
                h2(properties) {
                  return <h2 style={{color: 'papayawhip'}} {...properties} />
                }
              }}
            >
              <Content />
            </MDXProvider>
          </MDXProvider>
        ),
        '<h1 style="color:tomato;">hi</h1>\n<h2 style="color:papayawhip;">hello</h2>'
      )
    }
  )

  await t.test('should support components as a function', async function () {
    const {default: Content} = await evaluate('# hi\n## hello', {
      ...runtime,
      useMDXComponents
    })

    assert.equal(
      render(
        <MDXProvider
          components={{
            h1(properties) {
              return <h1 style={{color: 'tomato'}} {...properties} />
            },
            h2(properties) {
              return <h2 style={{color: 'rebeccapurple'}} {...properties} />
            }
          }}
        >
          <MDXProvider
            components={function () {
              return {
                h2(properties) {
                  return <h2 style={{color: 'papayawhip'}} {...properties} />
                }
              }
            }}
          >
            <Content />
          </MDXProvider>
        </MDXProvider>
      ),
      '<h1>hi</h1>\n<h2 style="color:papayawhip;">hello</h2>'
    )
  })

  await t.test(
    'should support a `disableParentContext` prop (sandbox)',
    async function () {
      const {default: Content} = await evaluate('# hi', {
        ...runtime,
        useMDXComponents
      })

      assert.equal(
        render(
          <MDXProvider
            components={{
              h1(properties) {
                return <h1 style={{color: 'tomato'}} {...properties} />
              }
            }}
          >
            <MDXProvider disableParentContext>
              <Content />
            </MDXProvider>
          </MDXProvider>
        ),
        '<h1>hi</h1>'
      )
    }
  )

  await t.test(
    'should support a `disableParentContext` *and* `components` as a function',
    async function () {
      const {default: Content} = await evaluate('# hi\n## hello', {
        ...runtime,
        useMDXComponents
      })

      assert.equal(
        render(
          <MDXProvider
            components={{
              h1(properties) {
                return <h1 style={{color: 'tomato'}} {...properties} />
              }
            }}
          >
            <MDXProvider
              disableParentContext
              components={function () {
                return {
                  h2(properties) {
                    return <h2 style={{color: 'papayawhip'}} {...properties} />
                  }
                }
              }}
            >
              <Content />
            </MDXProvider>
          </MDXProvider>
        ),
        '<h1>hi</h1>\n<h2 style="color:papayawhip;">hello</h2>'
      )
    }
  )
})
