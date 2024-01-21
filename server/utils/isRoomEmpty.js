const isRoomEmpty = (roomid, io) => {
  const room = io.sockets.adapter.rooms.get(roomid);
  return room ? room.size === 0 : true;
};

export default isRoomEmpty;
