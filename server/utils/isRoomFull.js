const isRoomFull = (roomId, io) => {
  const room = io.sockets.adapter.rooms.get(roomId);
  return room.size === 2;
};

export default isRoomFull;
