'use client';

import { FC } from 'react';
import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  Button,
  TextField,
  InputAdornment,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Chip,
} from '@mui/material';
import { FilterList, Close } from '@mui/icons-material';

interface Project {
  id: number;
  name: string;
  color: string;
  count: number;
  archived?: boolean;
}

interface ProjectsModalProps {
  open: boolean;
  onClose: () => void;
  orgId: number;
}

const ProjectsModal: FC<ProjectsModalProps> = ({ open, onClose, orgId }) => {
  // Mock data - replace with real API calls
  const recentProjects: Project[] = [
    { id: 1, name: 'Mayday bonanza', color: '#4CAF50', count: 2 },
    { id: 2, name: 'Members drive', color: '#9C27B0', count: 10 },
    { id: 3, name: "Renters' action group", color: '#00BCD4', count: 6, archived: true },
  ];

  const sharedProjects: Project[] = [
    { id: 4, name: 'Study 2025', color: '#FFC107', count: 1 },
    { id: 5, name: 'Comms', color: '#E1BEE7', count: 2 },
  ];

  const activeProjects: Project[] = [
    { id: 6, name: 'March 8', color: '#FF9800', count: 6 },
  ];

  const handleProjectClick = (projectId: number) => {
    onClose();
    window.location.href = `/organize_new/${orgId}/projects/${projectId}`;
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          maxHeight: '80vh',
        },
      }}
    >
      <DialogContent sx={{ p: 0 }}>
        {/* Header */}
        <Box
          sx={{
            p: 2,
            pb: 1,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Typography variant="h6" fontWeight={600}>
            Projects
          </Typography>
          <Button
            variant="contained"
            size="small"
            sx={{
              backgroundColor: '#000',
              color: 'white',
              '&:hover': {
                backgroundColor: '#333',
              },
              textTransform: 'none',
              fontWeight: 600,
              borderRadius: 1,
              px: 2,
            }}
          >
            New
          </Button>
        </Box>

        {/* Filter Input */}
        <Box sx={{ p: 2 }}>
          <TextField
            fullWidth
            placeholder="Type to filter"
            size="small"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <FilterList sx={{ color: 'text.secondary' }} />
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: 'grey.50',
              },
            }}
          />
        </Box>

        {/* Recent Section */}
        <Box sx={{ px: 2, pb: 1 }}>
          <Typography
            variant="subtitle2"
            fontWeight={600}
            sx={{ mb: 1, color: 'text.secondary' }}
          >
            Recent
          </Typography>
          <List disablePadding>
            {recentProjects.map((project) => (
              <ListItemButton
                key={project.id}
                onClick={() => handleProjectClick(project.id)}
                sx={{
                  borderRadius: 1,
                  mb: 0.5,
                  '&:hover': {
                    backgroundColor: 'grey.100',
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <Box
                    sx={{
                      width: 24,
                      height: 24,
                      backgroundColor: project.color,
                      transform: 'rotate(45deg)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  />
                </ListItemIcon>
                <ListItemText
                  primary={project.name}
                  sx={{
                    '& .MuiListItemText-primary': {
                      fontWeight: 500,
                      textDecoration: project.archived ? 'line-through' : 'none',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                    },
                  }}
                />
                {project.archived && (
                  <Close sx={{ fontSize: 16, color: 'error.main', mr: 1 }} />
                )}
                <Chip
                  label={project.count}
                  size="small"
                  sx={{
                    backgroundColor: 'grey.200',
                    fontWeight: 600,
                    height: 24,
                    minWidth: 32,
                  }}
                />
              </ListItemButton>
            ))}
          </List>
        </Box>

        {/* Shared to you Section */}
        <Box sx={{ px: 2, pb: 1 }}>
          <Typography
            variant="subtitle2"
            fontWeight={600}
            sx={{ mb: 1, color: 'text.secondary' }}
          >
            Shared to you
          </Typography>
          <List disablePadding>
            {sharedProjects.map((project) => (
              <ListItemButton
                key={project.id}
                onClick={() => handleProjectClick(project.id)}
                sx={{
                  borderRadius: 1,
                  mb: 0.5,
                  '&:hover': {
                    backgroundColor: 'grey.100',
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <Box
                    sx={{
                      width: 24,
                      height: 24,
                      backgroundColor: project.color,
                      transform: 'rotate(45deg)',
                    }}
                  />
                </ListItemIcon>
                <ListItemText
                  primary={project.name}
                  sx={{
                    '& .MuiListItemText-primary': {
                      fontWeight: 500,
                    },
                  }}
                />
                <Chip
                  label={project.count}
                  size="small"
                  sx={{
                    backgroundColor: 'grey.200',
                    fontWeight: 600,
                    height: 24,
                    minWidth: 32,
                  }}
                />
              </ListItemButton>
            ))}
          </List>
        </Box>

        {/* Active Section */}
        <Box sx={{ px: 2, pb: 2 }}>
          <Typography
            variant="subtitle2"
            fontWeight={600}
            sx={{ mb: 1, color: 'text.secondary' }}
          >
            Active
          </Typography>
          <List disablePadding>
            {activeProjects.map((project) => (
              <ListItemButton
                key={project.id}
                onClick={() => handleProjectClick(project.id)}
                sx={{
                  borderRadius: 1,
                  mb: 0.5,
                  '&:hover': {
                    backgroundColor: 'grey.100',
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <Box
                    sx={{
                      width: 24,
                      height: 24,
                      backgroundColor: project.color,
                      transform: 'rotate(45deg)',
                    }}
                  />
                </ListItemIcon>
                <ListItemText
                  primary={project.name}
                  sx={{
                    '& .MuiListItemText-primary': {
                      fontWeight: 500,
                    },
                  }}
                />
                <Chip
                  label={project.count}
                  size="small"
                  sx={{
                    backgroundColor: 'grey.200',
                    fontWeight: 600,
                    height: 24,
                    minWidth: 32,
                  }}
                />
              </ListItemButton>
            ))}
          </List>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectsModal;
