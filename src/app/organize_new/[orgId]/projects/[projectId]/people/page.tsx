'use client';

import { FC } from 'react';
import {
  Box,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  IconButton,
  Chip,
} from '@mui/material';
import {
  Add,
  PersonAdd,
  Upload,
  MoreVert,
  FiberManualRecord,
} from '@mui/icons-material';

import ZUIText from 'zui/components/ZUIText';

interface Props {
  params: {
    orgId: string;
    projectId: string;
  };
}

// Mock data for project team members
const mockTeamMembers = [
  { id: 1, name: 'Anna Svensson', email: 'anna@example.com', phone: '+46 70 123 4567', tags: ['Organizer', 'Admin'] },
  { id: 2, name: 'Erik Johansson', email: 'erik@example.com', phone: '+46 70 234 5678', tags: ['Member'] },
  { id: 3, name: 'Maria Andersson', email: 'maria@example.com', phone: '+46 70 345 6789', tags: ['Volunteer'] },
];

// Mock data for target lists
const mockTargetLists = [
  { id: 1, title: 'Project Team', date: 'Date', type: 'Smart', numPeople: 'numPeople', edit: false },
  { id: 2, title: 'Event Signups', date: 'Date', type: 'Smart', numPeople: 'numPeople', edit: false },
  { id: 3, title: 'New Members', date: 'Date', type: 'Smart', numPeople: 'numPeople', edit: false },
  { id: 4, title: 'Passive Members', date: 'Date', type: 'Smart', numPeople: 'numPeople', edit: false },
  { id: 5, title: '', date: 'Date', type: 'Plain', numPeople: 'numPeople', edit: true },
];

const ProjectPeoplePage: FC<Props> = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Project Team Section */}
      <Box sx={{ mb: 6 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box sx={{ mb: 1 }}>
            <ZUIText variant="headingSm" gutterBottom>
              Project Team
            </ZUIText>
            <ZUIText variant="bodyMdRegular" color="secondary">
              Members who can manage and organize this project
            </ZUIText>
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="outlined"
              startIcon={<Upload />}
              sx={{ textTransform: 'none' }}
            >
              Bulk Add
            </Button>
            <Button
              variant="contained"
              startIcon={<PersonAdd />}
              sx={{ textTransform: 'none' }}
            >
              Add People
            </Button>
          </Box>
        </Box>

        <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: 'rgba(0, 0, 0, 0.02)' }}>
                <TableCell>
                  <ZUIText variant="bodySmSemiBold">Name</ZUIText>
                </TableCell>
                <TableCell>
                  <ZUIText variant="bodySmSemiBold">Email</ZUIText>
                </TableCell>
                <TableCell>
                  <ZUIText variant="bodySmSemiBold">Phone</ZUIText>
                </TableCell>
                <TableCell>
                  <ZUIText variant="bodySmSemiBold">Tags</ZUIText>
                </TableCell>
                <TableCell width={50}></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {mockTeamMembers.map((member) => (
                <TableRow key={member.id} hover>
                  <TableCell>
                    <ZUIText variant="bodyMdRegular">{member.name}</ZUIText>
                  </TableCell>
                  <TableCell>
                    <ZUIText variant="bodyMdRegular" color="secondary">
                      {member.email}
                    </ZUIText>
                  </TableCell>
                  <TableCell>
                    <ZUIText variant="bodyMdRegular" color="secondary">
                      {member.phone}
                    </ZUIText>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      {member.tags.map((tag) => (
                        <Chip key={tag} label={tag} size="small" />
                      ))}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <IconButton size="small">
                      <MoreVert fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* Target Lists Section */}
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <ZUIText variant="headingLg">
            Target Lists
          </ZUIText>
          <Button
            variant="contained"
            startIcon={<Add />}
            sx={{ textTransform: 'none' }}
          >
            Create List
          </Button>
        </Box>

        <Box
          sx={{
            p: 3,
            backgroundColor: 'grey.100',
            borderRadius: 2,
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {mockTargetLists.map((list) => (
              <Paper
                key={list.id}
                sx={{
                  p: 2,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  backgroundColor: 'white',
                  border: '1px solid',
                  borderColor: 'divider',
                }}
                elevation={0}
              >
                {list.title && (
                  <Box sx={{ minWidth: 180 }}>
                    <ZUIText variant="bodyMdSemiBold">
                      {list.title}
                    </ZUIText>
                  </Box>
                )}
                <Chip
                  label={list.date}
                  sx={{
                    backgroundColor: 'grey.300',
                    borderRadius: 1,
                    fontWeight: 500,
                  }}
                />
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <FiberManualRecord
                    sx={{
                      fontSize: 10,
                      color: list.type === 'Smart' ? 'primary.main' : 'info.main',
                    }}
                  />
                  <ZUIText variant="bodyMdRegular">{list.type}</ZUIText>
                </Box>
                <Chip
                  label={list.numPeople}
                  sx={{
                    backgroundColor: 'grey.300',
                    borderRadius: 1,
                    fontWeight: 500,
                  }}
                />
                {list.edit && (
                  <Chip
                    label="edit"
                    sx={{
                      backgroundColor: 'grey.300',
                      borderRadius: 1,
                      fontWeight: 500,
                      ml: 'auto',
                    }}
                  />
                )}
              </Paper>
            ))}
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default ProjectPeoplePage;
