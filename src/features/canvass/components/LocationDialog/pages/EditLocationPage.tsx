'use client';

import { Box, Button, TextField } from '@mui/material';
import { FC, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

import PageBase from './PageBase';
import { ZetkinLocation } from 'features/areaAssignments/types';
import { Msg, useMessages } from 'core/i18n';
import messageIds from 'features/canvass/l10n/messageIds';

type EditLocationPageProps = {
  location: ZetkinLocation;
  onBack: () => void;
  onClose: () => void;
  onSave: (title: string, description: string) => void;
};

// Wrapper to ensure client-only rendering
const TextFieldClientOnly = dynamic(
  () => Promise.resolve(({ value, onChange, label, ...props }: any) => (
    <TextField
      {...props}
      label={label}
      onChange={onChange}
      value={value}
    />
  )),
  { ssr: false }
);

const EditLocationPage: FC<EditLocationPageProps> = ({
  onClose,
  onBack,
  onSave,
  location,
}) => {
  const messages = useMessages(messageIds);

  const [title, setTitle] = useState(location.title || '');
  const [description, setDescription] = useState(location.description || '');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setTitle(location.title || '');
    setDescription(location.description || '');
  }, [location]);

  const nothingHasBeenEdited =
    title == location.title &&
    (description == location.description ||
      (!description && !location.description));

  return (
    <PageBase
      actions={
        <Button
          disabled={nothingHasBeenEdited || title.length === 0}
          loading={isLoading}
          onClick={async () => {
            setIsLoading(true);
            await onSave(title, description);
            setIsLoading(false);
          }}
          variant="contained"
        >
          <Msg id={messageIds.location.edit.saveButtonLabel} />
        </Button>
      }
      onBack={onBack}
      onClose={onClose}
      title={messages.location.edit.header({
        title: location.title,
      })}
    >
      <form
        onSubmit={(ev) => {
          setIsLoading(true);
          ev.preventDefault();
          onSave(title, description);
          setIsLoading(false);
        }}
      >
        <Box display="flex" flexDirection="column" gap={2} height="100%">
          <TextFieldClientOnly
            fullWidth
            label={messages.location.edit.titleLabel()}
            onChange={(ev: any) => setTitle(ev.target.value)}
            value={title}
          />
          <TextFieldClientOnly
            fullWidth
            label={messages.location.edit.descriptionLabel()}
            multiline
            onChange={(ev: any) => setDescription(ev.target.value)}
            rows={5}
            value={description}
          />
        </Box>
      </form>
    </PageBase>
  );
};

export default EditLocationPage;
