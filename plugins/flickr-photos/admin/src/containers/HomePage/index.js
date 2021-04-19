/*
 *
 * HomePage
 *
 */

import React, { memo, useCallback, useState, useRef } from "react";
import {
  ContainerFluid,
  Button,
  Label,
  InputText,
  request,
} from "strapi-helper-plugin";

import styled from "styled-components";

const Form = styled.div`
  max-width: 50%;
  margin-top: 2rem;
  text-align: right;

  button {
    margin-right: 0;
  }
`;

const Field = styled.div`
  text-align: left;
`;

const Albums = styled.div`
  img {
    max-width: 20rem;
    margin: 1rem;
  }
`;

const HomePage = memo(() => {
  const [loading, toggleLoading] = useState(false);
  const [albumId, onAlbumIdChanged] = useState("72157718959970459");
  const [album, setAlbums] = useState(null);

  const handleChange = useCallback((e) => {
    onAlbumIdChanged(e.target.value);
  }, []);

  const handleSync = useCallback(async () => {
    setAlbums(null);
    toggleLoading(true);
    try {
      const resp = await request(`/flickr-photos/sync?albumId=${albumId}`);
      setAlbums(resp);
      strapi.notification.success("Sync Successfully.");
    } catch (e) {
      strapi.notification.error(e.message);
    }
    toggleLoading(false);
  }, [albumId]);

  return (
    <ContainerFluid>
      <h1>Flickr Photos</h1>
      <Form>
        <Field>
          <Label message="Album ID">Album ID</Label>
          <InputText name="albumId" value={albumId} onChange={handleChange} />
        </Field>
        <br />

        <Button
          kind="primary"
          type="submit"
          primary
          onClick={handleSync}
          loader={loading}
          disabled={loading}
        >
          Sync Photos
        </Button>
      </Form>
      {album && (
        <Albums>
          <h2>{`Album ${album?.name}`}</h2>
          {album?.photos.map((photo) => (
            <img src={photo.photoURL} alt={photo.name} />
          ))}
        </Albums>
      )}
    </ContainerFluid>
  );
});

export default memo(HomePage);
