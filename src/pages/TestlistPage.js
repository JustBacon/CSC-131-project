import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { client } from '../context/dataContext';
import { Container } from '@mui/material';
import '../styles/App.css';
import { Button, ProgressBar } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

export const TestlistPage = () => {

  const {deviceName} = useParams()
  const [rows, setRows] = useState([])

  useEffect(() => {
    const getTestRows = async () => {
      const checkDeviceName = await client.entities.test.list({
        filter: {
          Device: {
            contains: deviceName
          }
        }
      })
      const someObject = checkDeviceName.items.map(item => {
        const objectContainer = {};
        objectContainer.id = item.TestID
        objectContainer.device = item.Device
        objectContainer.orgassignment = item.OrgAssignment
        objectContainer.testname = item.TestName
        objectContainer.testmethod = item.TestMethod
        objectContainer.notes = item.Notes
        objectContainer.completed = item.Completed
        objectContainer.updatedby = item.UpdatedBy
        return objectContainer
      })
  
      setRows(someObject)
    }
    getTestRows()
  })

  const columns = [
    { field: 'id', 
      headerName: 'TestID', 
      width: 90},
    {
      field: 'device',
      headerName: 'Device',
      width: 120,
      editable: true,
    },
    {
      field: 'orgassignment',
      headerName: 'OrgAssignment',
      width: 150,
      editable: true,
    },
    {
      field: 'testname',
      headerName: 'TestName',
      width: 150,
      editable: true,
    },
    {
      field: 'testmethod',
      headerName: 'TestMethod',
      width: 150,
      editable: true,
    },
    {
      field: 'notes',
      headerName: 'Notes',
      width: 150,
      editable: true,
    },
    {
      field: 'completed',
      headerName: 'Completed',
      width: 150,
      editable: true,
    },
    {
      field: 'updatedby',
      headerName: 'UpdatedBy',
      width: 150,
      editable: true,
    },
    {
      field: 'actions',
      type: 'actions',
      width: 150,
      editable: true,
      type: 'singleSelect',
      valueOptions: ['Market', 'Finance', 'Development'],
      /*
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<SaveIcon />}
              label="Save"
              sx={{
                color: 'primary.main',
              }}
              onClick={handleSaveClick(id)}
            />,
            <GridActionsCellItem
              icon={<CancelIcon />}
              label="Cancel"
              className="textPrimary"
              onClick={handleCancelClick(id)}
              color="inherit"
            />,
          ];
        }

        return [
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            className="textPrimary"
            onClick={handleEditClick(id)}
            color="inherit"
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={handleDeleteClick(id)}
            color="inherit"
          />,
        ];
      },*/
    },

  ];

  return (
    <div className="test-list-page">
      <div><h2 id="subtitle-name">Test List for: {deviceName}</h2></div>
      <div className="test-list-data">
      <div id="search-for-device">
        <form autoComplete="off">

          <input id="search-for-device-input"
            type="text"
            name="testName"
            placeholder="Test Name"
          />
          <select name="device">
                {/* {deviceList?.map((item, index) => (
                    <option key={index} value={item.Device}>{item.Device}</option>
                )
                )} */}
                <option>test1</option>
                <option>test1</option>
                <option>test1</option>
          </select>
          <Button id="search-for-device-button" variant="primary">Search</Button>
        </form>
      </div>
        <Box sx={{ height: 400, width: '100%', borderColor: 'primary.dark', '& .MuiDataGrid-cell:hover': {color: 'primary.main'} }} >
          <Container>

          <DataGrid className='test-list-data-table'
            rows={rows}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 5,
                },
              },
            }}
            pageSizeOptions={[5]}
            checkboxSelection
            disableRowSelectionOnClick
            />
            </Container>
        </Box>
      </div>
    </div>
  );
}