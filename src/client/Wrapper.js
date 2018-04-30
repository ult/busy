import React from 'react';
import PropTypes from 'prop-types';
import url from 'url';
import { connect } from 'react-redux';
import { IntlProvider, addLocaleData } from 'react-intl';
import { withRouter } from 'react-router-dom';
import { renderRoutes } from 'react-router-config';
import { LocaleProvider, Layout } from 'antd';
import enUS from 'antd/lib/locale-provider/en_US';
import { findLanguage } from './translations';
import {
  getIsLoaded,
  getAuthenticatedUser,
  getAuthenticatedUserName,
  getLocale,
  getUsedLocale,
  getUseBeta,
} from './reducers';
import { login, logout, busyLogin } from './auth/authActions';
import { getFollowing, getNotifications } from './user/userActions';
import {
  getRate,
  getRewardFund,
  getTrendingTopics,
  setUsedLocale,
  busyAPIHandler,
  setAppUrl,
} from './app/appActions';
import * as reblogActions from './app/Reblog/reblogActions';
import busyAPI from './busyAPI';
import Redirect from './components/Utils/Redirect';
import Loading from './components/Icon/Loading';
import NotificationPopup from './notifications/NotificationPopup';
import Topnav from './components/Navigation/Topnav';
import Transfer from './wallet/Transfer';

@withRouter
@connect(
  state => ({
    loaded: getIsLoaded(state),
    user: getAuthenticatedUser(state),
    username: getAuthenticatedUserName(state),
    usedLocale: getUsedLocale(state),
    locale: getLocale(state),
  }),
  {
    login,
    logout,
    getFollowing,
    getNotifications,
    getRate,
    getRewardFund,
    getTrendingTopics,
    busyLogin,
    busyAPIHandler,
    getRebloggedList: reblogActions.getRebloggedList,
    setUsedLocale,
  },
)
export default class Wrapper extends React.PureComponent {
  static propTypes = {
    route: PropTypes.shape().isRequired,
    loaded: PropTypes.bool.isRequired,
    user: PropTypes.shape().isRequired,
    locale: PropTypes.string.isRequired,
    usedLocale: PropTypes.string.isRequired,
    history: PropTypes.shape().isRequired,
    username: PropTypes.string,
    login: PropTypes.func,
    logout: PropTypes.func,
    getFollowing: PropTypes.func,
    getRewardFund: PropTypes.func,
    getRebloggedList: PropTypes.func,
    getRate: PropTypes.func,
    getTrendingTopics: PropTypes.func,
    getNotifications: PropTypes.func,
    setUsedLocale: PropTypes.func,
    busyLogin: PropTypes.func,
    busyAPIHandler: PropTypes.func,
  };

  static defaultProps = {
    username: '',
    login: () => {},
    logout: () => {},
    getFollowing: () => {},
    getRewardFund: () => {},
    getRebloggedList: () => {},
    getRate: () => {},
    getTrendingTopics: () => {},
    getNotifications: () => {},
    setUsedLocale: () => {},
    busyLogin: () => {},
    busyAPIHandler: () => {},
  };

  static async fetchData({ store, req, res }) {
    await store.dispatch(login());

    const appUrl = url.format({
      protocol: req.protocol,
      host: req.get('host'),
    });

    store.dispatch(setAppUrl(appUrl));

    const state = store.getState();

    const useBeta = getUseBeta(state);

    if (useBeta && appUrl === 'https://busy.org') {
      res.redirect(`https://staging.busy.org${req.originalUrl}`);
      return;
    }

    const languages = req
      .get('Accept-Language')
      .split(',')
      .map(lang => lang.split(';')[0]);

    const id = await Wrapper.loadLanguage(languages[0]);

    if (!id) {
      return;
    }

    store.dispatch(setUsedLocale(id));
  }

  static async loadLanguage(locale) {
    const language = findLanguage(locale);

    if (!language) {
      return null;
    }

    const localeDataPromise = import(`react-intl/locale-data/${language.localeData}`);
    const translationsPromise = import(`./locales/${language.translations}`);

    const [localeData, translations] = await Promise.all([localeDataPromise, translationsPromise]);

    console.log('lodaleData', localeData);

    addLocaleData(localeData);
    global.translations = translations;

    return language.id;
  }

  constructor(props) {
    super(props);

    this.loadLocale = this.loadLocale.bind(this);
    this.handleMenuItemClick = this.handleMenuItemClick.bind(this);
  }

  componentDidMount() {
    const { locale } = this.props;

    this.props.login().then(() => {
      this.props.getFollowing();
      this.props.getNotifications();
      this.props.busyLogin();
    });

    this.props.getRewardFund();
    this.props.getRebloggedList();
    this.props.getRate();
    this.props.getTrendingTopics();

    busyAPI.subscribe(this.props.busyAPIHandler);

    this.loadLocale(locale);
  }

  componentWillReceiveProps(nextProps) {
    const { locale } = this.props;

    if (locale !== nextProps.locale) {
      this.loadLocale(nextProps.locale);
    }
  }

  async loadLocale(locale) {
    const id = await Wrapper.loadLanguage(locale);
    if (!id) {
      return;
    }

    this.props.setUsedLocale(id);
  }

  handleMenuItemClick(key) {
    switch (key) {
      case 'logout':
        this.props.logout();
        break;
      case 'activity':
        this.props.history.push('/activity');
        break;
      case 'replies':
        this.props.history.push('/replies');
        break;
      case 'bookmarks':
        this.props.history.push('/bookmarks');
        break;
      case 'drafts':
        this.props.history.push('/drafts');
        break;
      case 'settings':
        this.props.history.push('/settings');
        break;
      case 'feed':
        this.props.history.push('/');
        break;
      case 'news':
        this.props.history.push('/trending');
        break;
      case 'wallet':
        this.props.history.push('/wallet');
        break;
      case 'my-profile':
        this.props.history.push(`/@${this.props.username}`);
        break;
      default:
        break;
    }
  }

  render() {
    const { user, locale } = this.props;

    const language = findLanguage(locale);

    if (!language) return <Loading />;

    return (
      <IntlProvider key={language.id} locale={language.localeData} messages={global.translations}>
        <LocaleProvider locale={enUS}>
          <Layout data-dir={language && language.rtl ? 'rtl' : 'ltr'}>
            <Layout.Header style={{ position: 'fixed', width: '100vw', zIndex: 1050 }}>
              <Topnav username={user.name} onMenuItemClick={this.handleMenuItemClick} />
            </Layout.Header>
            <div className="content">
              {renderRoutes(this.props.route.routes)}
              <Redirect />
              <Transfer />
              <NotificationPopup />
            </div>
          </Layout>
        </LocaleProvider>
      </IntlProvider>
    );
  }
}
