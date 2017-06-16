import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ReactDOMServer from 'react-dom/server'
import { omit } from 'lodash'

// See: https://github.com/webpack/react-starter/issues/37
const isBrowser = typeof window !== 'undefined'
const SVGInjector = isBrowser ? require('svg-injector') : undefined

export default class ReactSVG extends Component {

  static defaultProps = {
    callback: () => {},
    component: 'span',
    className: '',
    evalScripts: 'once',
    style: {}
  }

  static propTypes = {
    callback: PropTypes.func,
    component: PropTypes.string,
    className: PropTypes.string,
    evalScripts: PropTypes.oneOf([ 'always', 'once', 'never' ]),
    path: PropTypes.string.isRequired,
    style: PropTypes.object
  }

  refCallback = (container) => {
    if (!container) {
      this.removeSVG()
      return
    }
    this.container = container
    this.renderSVG()
  }

  renderSVG(props = this.props) {
    const {
      callback: each,
      evalScripts,
      path
    } = props

    const div = document.createElement('div')

    div.innerHTML = ReactDOMServer.renderToStaticMarkup(
      <div data-src={path} />
    )

    const wrapper = this.container.appendChild(div.firstChild)

    SVGInjector(wrapper, {
      evalScripts,
      each
    })
  }

  removeSVG() {
    this.container.removeChild(this.container.firstChild)
  }

  componentWillReceiveProps(nextProps) {
    this.removeSVG()
    this.renderSVG(nextProps)
  }

  shouldComponentUpdate(nextProps) {
    return this.props !== nextProps
  }

  render() {
    const Component = this.props.component
    const restProps = omit(this.props, Object.keys(ReactSVG.propTypes))
    return (
      <Component ref={this.refCallback}
        className={this.props.className}
        style={this.props.style}
        {...restProps} />
    )
  }

}
