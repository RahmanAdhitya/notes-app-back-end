/* eslint-disable import/no-extraneous-dependencies */
const { nanoid } = require('nanoid');
const notes = require('./notes');

const addNoteHandler = (request, h) => {
  const { title, tags, body } = request.payload;

  const id = nanoid(16);
  const createdAt = new Date().toISOString();
  const updatedAt = createdAt;

  const newNote = {
    title, tags, body, id, createdAt, updatedAt,
  };

  notes.push(newNote);

  const isSuccess = notes.filter((note) => note.id === id).length > 0;

  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Catatan berhasil di buat',
      data: {
        noteId: id,
      },
    });
    response.code(201);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Catatan gagal ditambahkan',
  });

  response.code(500);
  return response;
};

const getAllNotesHandler = () => ({
  status: 'success',
  data: {
    notes,
  },
});

const getNotesByIdHandler = (request, h) => {
  const { id } = request.params;

  const note = notes.filter((currentNotes) => currentNotes.id === id)[0];

  if (note !== undefined) {
    return {
      status: 'success',
      data: {
        note,
      },
    };
  }

  const response = h.response({
    status: 'fail',
    message: 'catatan tidak ditemukan',
  });

  response.code(404);
  return response;
};

const editNotesHandler = (request, h) => {
  const { id } = request.params;
  const { title, tag, body } = request.payload;

  const updatedAt = new Date().toISOString();

  const index = notes.findIndex((note) => note.id === id);

  if (index !== -1) {
    notes[index] = {
      ...notes[index],
      title,
      tag,
      body,
      updatedAt,
    };

    const response = h.response({
      status: 'Success',
      message: 'Catatan berhasil di perbaruhi',
    });

    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Catatan gagal di perbaruhi',
  });

  return response;
};

const deleteNotesHandler = (request, h) => {
  const { id } = request.params;

  const index = notes.findIndex((note) => note.id === id);

  if (index !== -1) {
    notes.splice(index, 1);
    const response = h.response({
      status: 'success',
      message: 'delete catatan berhasil',
    });

    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'menghapus catatan gagal, id tidak ditemukan',
  });

  response.code(404);
  return response;
};

module.exports = {
  addNoteHandler, getAllNotesHandler, getNotesByIdHandler, editNotesHandler, deleteNotesHandler,
};
