import React from 'react';
import PropTypes from 'prop-types';

import Link from 'next/link';

import AppBar from '@material-ui/core/AppBar';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/core/styles';
import MenuIcon from '@material-ui/icons/Menu';
import Toolbar from '@material-ui/core/Toolbar';

import { ButtonLink } from './LinksRef';
import { getAuthenticatedUsers, hasRole } from '../src/auth';

const useStyles = makeStyles((theme) => ({
  menuButton: {
    marginRight: theme.spacing(2),

    // Hide by default.
    display: 'none',

    // Only display menu button on mobile
    [theme.breakpoints.down('sm')]: {
      display: 'block',
    },
  },

  consoleButton: {
    fontWeight: 'bold',
    fontSize: '1.3em',
  },

  titleBox: {
    flexGrow: 1,
  },

  toolbar: {
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
      alignItems: 'flex-start',
    },
  },

  menuItems: {
    // Hide on mobile
    [theme.breakpoints.down('sm')]: {
      display: 'none',
    },
  },

  menuItemsExpanded: {
    // Expanded menu on mobile
    [theme.breakpoints.down('sm')]: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
    },
  },

  loggedAs: {
    backgroundColor: theme.palette.warning.main,
    padding: theme.spacing(1),
    marginLeft: theme.spacing(2),
    fontWeight: 'bold',
  },

}));

function AuthenticatedUser({ user }) {
  const classes = useStyles();

  return <div className={classes.loggedAs}>Connecté en tant que {user.name || user.email}</div>;
}

AuthenticatedUser.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string,
    email: PropTypes.string,
  }).isRequired,
};

export default function Menu({ user, logout }) {
  const classes = useStyles();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [authenticatedUsers, setAuthenticatedUsers] = React.useState([]);

  React.useEffect(
    async () => setAuthenticatedUsers(getAuthenticatedUsers()),
    [user],
  );

  const handleMenuToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <AppBar position="static">
      <Toolbar className={classes.toolbar}>

        <Box className={classes.titleBox} display="flex" alignItems="center">
          <IconButton onClick={handleMenuToggle} edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
            <MenuIcon />
          </IconButton>

          <Link href="/dashboards" passHref>
            <ButtonLink color="inherit" className={classes.consoleButton}>Console</ButtonLink>
          </Link>

          {
            authenticatedUsers.length > 1 && <AuthenticatedUser user={authenticatedUsers[0]} />
          }
        </Box>

        <Box display="flex" className={mobileOpen ? classes.menuItemsExpanded : classes.menuItems}>
          {user && (
            <>
              {
                hasRole(user, 'admin')
                && (
                  <Link href="/admin" passHref>
                    <ButtonLink color="inherit">Administration</ButtonLink>
                  </Link>
                )
              }
              <Link href="/dashboards" passHref>
                <ButtonLink color="inherit">Tableaux de bord</ButtonLink>
              </Link>
            </>
          )}

          <Link href="/documentation/introduction" passHref>
            <ButtonLink color="inherit">Documentation</ButtonLink>
          </Link>

          {user && (
            <>
              <Link href="/account" passHref>
                <ButtonLink color="inherit">Mon compte</ButtonLink>
              </Link>

              <Button onClick={logout} color="inherit">Déconnexion</Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}

Menu.defaultProps = {
  user: null,
};

Menu.propTypes = {
  user: PropTypes.shape({}),
  logout: PropTypes.func.isRequired,
};
