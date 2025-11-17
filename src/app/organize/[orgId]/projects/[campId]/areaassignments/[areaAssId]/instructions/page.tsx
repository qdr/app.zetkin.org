'use client';

import { useContext, useState } from 'react';
import { Box, Button, Link, Paper, Typography } from '@mui/material';

import { ZUIConfirmDialogContext } from 'zui/ZUIConfirmDialogProvider';
import ZUITextEditor from 'zui/ZUITextEditor';
import useAreaAssignmentInstructions from 'features/areaAssignments/hooks/useCanvassInstructions';
import { Msg, useMessages } from 'core/i18n';
import messageIds from 'features/areaAssignments/l10n/messageIds';
import { useNumericRouteParams } from 'core/hooks';

const AreaAssignmentInstructionsPage = () => {
  const { orgId, areaAssId } = useNumericRouteParams();
  const messages = useMessages(messageIds);
  const { showConfirmDialog } = useContext(ZUIConfirmDialogContext);

  const {
    hasNewText,
    instructions,
    isSaved,
    isSaving,
    isUnsaved,
    revert,
    save,
    setInstructions,
  } = useAreaAssignmentInstructions(orgId, areaAssId);
  const [key, setKey] = useState(1);

  return (
    <>
            <Box width="70%">
        <Paper
          sx={{
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              maxHeight: 'calc(max(35ch, 100vh - 300px))',
              minHeight: 0,
              padding: 2,
            }}
          >
            <Typography variant="h4">
              <Msg id={messageIds.instructions.title} />
            </Typography>
            <form
              onSubmit={(evt) => {
                evt.preventDefault();
                save();
              }}
              style={{ display: 'flex', flexDirection: 'column', minHeight: 0 }}
            >
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  marginBottom: 2,
                  marginTop: 4,
                  minHeight: 0,
                }}
              >
                <ZUITextEditor
                  key={key}
                  initialValue={instructions}
                  onChange={(markdown) => setInstructions(markdown)}
                  placeholder={messages.instructions.editor.editorPlaceholder()}
                />
              </Box>
              <Box alignItems="center" display="flex" justifyContent="flex-end">
                <Box marginRight={2}>
                  {isSaved && (
                    <Typography>
                      <Msg id={messageIds.instructions.editor.savedMessage} />
                    </Typography>
                  )}
                  {isUnsaved && (
                    <Typography component="span">
                      <Msg id={messageIds.instructions.editor.unsavedMessage} />
                      <Link
                        color="textPrimary"
                        component="span"
                        onClick={() => {
                          showConfirmDialog({
                            onSubmit: () => {
                              revert();
                              //Force Slate to re-mount
                              setKey((current) => current + 1);
                            },
                            warningText: messages.instructions.editor.confirm(),
                          });
                        }}
                        style={{ cursor: 'pointer', fontFamily: 'inherit' }}
                      >
                        <Msg id={messageIds.instructions.editor.revertLink} />
                      </Link>
                    </Typography>
                  )}
                </Box>
                <Button
                  color="primary"
                  disabled={!hasNewText}
                  type="submit"
                  variant="contained"
                >
                  <Msg
                    id={
                      isSaving
                        ? messageIds.instructions.editor.savingButton
                        : messageIds.instructions.editor.saveButton
                    }
                  />
                </Button>
              </Box>
            </form>
          </Box>
        </Paper>
      </Box>
    </>
  );
};

export default AreaAssignmentInstructionsPage;
