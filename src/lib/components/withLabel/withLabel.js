import React, { PureComponent } from 'react'
import cx from 'classnames'
import PropTypes from 'prop-types'
import { getIn } from 'formik'
import omit from 'lodash.omit'

import InfoMsg from '../InfoMsg'
import './styles.scss'

const withLabel = (component = 'input') => (
  WrappedComponent => class WithLabel extends PureComponent {
    static propTypes = {
      formik: PropTypes.instanceOf(Object).isRequired,
      name: PropTypes.string.isRequired,
      label: PropTypes.string,
      className: PropTypes.string,
      hint: PropTypes.string,
      placeholder: PropTypes.string,
      type: PropTypes.string,
      disabled: PropTypes.bool,
      required: PropTypes.bool,
      style: PropTypes.instanceOf(Object),
    }

    static defaultProps = {
      label: null,
      className: null,
      hint: null,
      placeholder: null,
      type: null,
      disabled: false,
      required: false,
      style: null,
    }

    state = {
      hide: false,
    }

    handleAutoFill = e => {
      this.setState({
        hide: e.animationName === 'onAutoFillStart',
      })
    }

    handleFocus = () => {
      this.setState({
        hide: true,
      })
    }

    handleBlur = () => {
      this.setState({
        hide: false,
      })
    }

    render() {
      const {
        formik: {
          touched, errors, values,
        },
        name,
        label,
        className,
        hint,
        placeholder,
        type,
        disabled,
        required,
        style,
      } = this.props
      const error = getIn(errors, name)
      const touch = getIn(touched, name)
      const value = getIn(values, name)
      const hide = this.state.hide || !!value || !!placeholder || !!(disabled && value)
      const hidden = type && type === 'hidden'
      const errorMsg = touch && error ? error : null
      const passableProps = omit(this.props, ['className', 'hint', 'label', 'style'])

      return (
        <div className={cx('form-element', `${component}-wrapper`, className, { hidden })} style={style}>
          <label
            htmlFor={name}
            className={cx({ isDisabled: disabled, hasError: !!errorMsg })}
          >
            {
              label && (
                <span className={cx({ hide })}>
                  {`${label}${required ? ' *' : ''}`}
                </span>
              )
            }
            <WrappedComponent
              onAnimationStart={this.handleAutoFill}
              onFocus={this.handleFocus}
              onBlur={this.handleBlur}
              {...passableProps}
            />
          </label>
          {
            !!errorMsg && (<InfoMsg errorMsg={errorMsg} />)
          }
          {
            hint && (<InfoMsg hintMsg={hint} />)
          }
        </div>
      )
    }
  }
)

export default withLabel