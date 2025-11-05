import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import { useNavigate } from 'react-router-dom';
import useLogout from '../hooks/useLogout';

const drawerWidth = 240;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
  }),
);

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  background: '#000000',
  color: '#ffffff',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

export default function PersistentDrawerLeft() {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const navigate= useNavigate();
  const logout = useLogout();

    const signOut = async () => {
        await logout();
        navigate('/login');
    }

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{ 
              mr: 2, 
              color: '#ffffff',
              '&:hover': {
                background: 'rgba(255, 255, 255, 0.1)',
              },
              ...(open && { display: 'none' }) 
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography 
            variant="h6" 
            noWrap 
            component="div"
            sx={{
              color: '#ffffff',
              fontWeight: 700,
              letterSpacing: '0.5px',
            }}
          >
            Menu
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            background: '#ffffff',
            borderRight: '1px solid #000000',
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <DrawerHeader sx={{ background: '#000000' }}>
          <IconButton 
            onClick={handleDrawerClose}
            sx={{ 
              color: '#ffffff',
              '&:hover': {
                background: 'rgba(255, 255, 255, 0.1)',
              }
            }}
          >
            {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          <ListItem 
            button 
            onClick={(e) => {
              navigate('/companylisting/1');
              handleDrawerClose();
            }}
            sx={{
              '&:hover': {
                background: 'rgba(0, 0, 0, 0.06)',
              }
            }}
          >
            <ListItemText 
              primary="Company List" 
              primaryTypographyProps={{
                style: { color: '#000000', fontWeight: 600 }
              }}
            />
          </ListItem>
          <ListItem 
            button 
            onClick={(e) => {
              navigate('/employeelist/1');
              handleDrawerClose();
            }}
            sx={{
              '&:hover': {
                background: 'rgba(0, 0, 0, 0.06)',
              }
            }}
          >
            <ListItemText 
              primary="Employee List" 
              primaryTypographyProps={{
                style: { color: '#000000', fontWeight: 600 }
              }}
            />
          </ListItem>
          <ListItem 
            button 
            onClick={(e) => {
              navigate('/cameras');
              handleDrawerClose();
            }}
            sx={{
              '&:hover': {
                background: 'rgba(0, 0, 0, 0.06)',
              }
            }}
          >
            <ListItemText 
              primary="Cameras" 
              primaryTypographyProps={{
                style: { color: '#000000', fontWeight: 600 }
              }}
            />
          </ListItem>
          <ListItem 
            button 
            onClick={(e) => {
              navigate('/attendance');
              handleDrawerClose();
            }}
            sx={{
              '&:hover': {
                background: 'rgba(0, 0, 0, 0.06)',
              }
            }}
          >
            <ListItemText 
              primary="Attendance" 
              primaryTypographyProps={{
                style: { color: '#000000', fontWeight: 600 }
              }}
            />
          </ListItem>
          <ListItem 
            button 
            onClick={signOut}
            sx={{
              '&:hover': {
                background: 'rgba(0, 0, 0, 0.06)',
              }
            }}
          >
            <ListItemText 
              primary="Log Out" 
              primaryTypographyProps={{
                style: { color: '#000000', fontWeight: 700 }
              }}
            />
          </ListItem>
        </List>
      </Drawer>
    </Box>
  );
}