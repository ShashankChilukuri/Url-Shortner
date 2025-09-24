import { Pagination, Table, Text, Container, Stack, ActionIcon, Tooltip, Modal, TextInput, Button } from '@mantine/core';
import React, { useEffect, useState } from 'react';
import Service from '../utils/http';
import { IconEdit, IconTrash } from '@tabler/icons-react';
const s = new Service();

export default function UrlsTable() {
  const [activePage, setPage] = useState(1);
  const [data, setData] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(null);

  // Edit modal state
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editData, setEditData] = useState({ shortCode: "", originalUrl: "", title: "" });

  const getData = async (pno, limit) => {
    try {
      setLoading(true);
      const response = await s.get(`url/my/urls?page=${pno}&limit=${limit}`);
      setData(response?.urls || []);
      setTotalPages(response?.totalPages || 1);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData(activePage, 10);
  }, [activePage]);

  const handleDeleteClick = async (shortCode) => {
    if (window.confirm(`Are you sure you want to delete the short URL: ${shortCode}?`)) {
      try {
        setDeleting(shortCode);
        const response = await s.delete(`url/delete/${shortCode}`);
        window.alert(response.message);
        getData(activePage, 10);
      } catch (err) {
        console.error(err);
        window.alert("Failed to delete URL");
      } finally {
        setDeleting(null);
      }
    }
  };

  // Open edit modal
  const handleEditClick = (element) => {
    setEditData({
      shortCode: element.shortCode,
      originalUrl: element.originalUrl,
      title: element.title || "",
    });
    setEditModalOpen(true);
  };

  // Submit edited URL
  const handleEditSubmit = async () => {
    try {
      const response = await s.put(`url/edit/`, {
        shortCode:editData.shortCode,
        originalUrl: editData.originalUrl,
        title: editData.title,
      });
      window.alert(response.message);
      setEditModalOpen(false);
      getData(activePage, 10);
    } catch (err) {
      console.error(err);
      window.alert("Failed to edit URL");
    }
  };

  const rows = data.length > 0 ? data.map((element, index) => (
    <Table.Tr key={element._id}>
      <Table.Td>{(activePage - 1) * 10 + index + 1}</Table.Td>
      <Table.Td>{element.originalUrl}</Table.Td>
      <Table.Td>
        <a
          href={`http://localhost:3000/api/url/${element.shortCode}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          {element.shortCode}
        </a>
      </Table.Td>
      <Table.Td>{element.clickCount}</Table.Td>
      <Table.Td>
        <Tooltip label="Edit URL" withArrow>
          <ActionIcon color="blue" variant="light" onClick={() => handleEditClick(element)}>
            <IconEdit size={16} />
          </ActionIcon>
        </Tooltip>
      </Table.Td>
      <Table.Td>
        <Tooltip label="Delete URL" withArrow>
          <ActionIcon
            color="red"
            variant="light"
            onClick={() => handleDeleteClick(element.shortCode)}
            loading={deleting === element.shortCode}
          >
            <IconTrash size={16} />
          </ActionIcon>
        </Tooltip>
      </Table.Td>
    </Table.Tr>
  )) : (
    <Table.Tr>
      <Table.Td colSpan={6}>
        <Text align="center">No URLs found</Text>
      </Table.Td>
    </Table.Tr>
  );

  return (
    <Container>
      <Stack>
        <Table withBorder>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>ID</Table.Th>
              <Table.Th>Original Url</Table.Th>
              <Table.Th>Short Url</Table.Th>
              <Table.Th>Clicks</Table.Th>
              <Table.Th>Edit</Table.Th>
              <Table.Th>Delete</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {loading ? (
              <Table.Tr>
                <Table.Td colSpan={6}>
                  <Text align="center">Loading...</Text>
                </Table.Td>
              </Table.Tr>
            ) : rows}
          </Table.Tbody>
        </Table>
        <Pagination
          value={activePage}
          onChange={setPage}
          total={totalPages}
          positionPagination="bottom"
        />
      </Stack>

      {/* Edit Modal */}
      <Modal
        opened={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title="Edit Short URL"
        centered
      >
        <Stack>
          <TextInput
            label="Original URL"
            value={editData.originalUrl}
            onChange={(e) => setEditData({ ...editData, originalUrl: e.target.value })}
          />
          <TextInput
            label="Title"
            value={editData.title}
            onChange={(e) => setEditData({ ...editData, title: e.target.value })}
          />
          <Button onClick={handleEditSubmit}>Save Changes</Button>
        </Stack>
      </Modal>
    </Container>
  );
}
