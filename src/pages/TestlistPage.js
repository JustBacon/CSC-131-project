import Box from '@mui/material/Box';
import { DataGrid, GridToolbar, GridToolbarColumnsButton, GridToolbarContainer, GridToolbarFilterButton } from '@mui/x-data-grid';
import { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { client } from '../context/dataContext';
import { Container } from '@mui/material';
import '../styles/App.css';
import { Button, ProgressBar } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import { DataContext } from '../context/dataContext';
import {
  GridRowModes,
  GridActionsCellItem,
  GridRowEditStopReasons,
} from '@mui/x-data-grid';


// function EditToolbar(props) {
//   const { setRows, setRowModesModel } = props;

//   const handleClick = (item) => {
//     console.log(item)
//     const id = randomId();
//     setRows((oldRows) => [...oldRows, { id, device: '', orgassignment: '', testname: '', testmethod: '', notes: '', completed: false, updatedby: '' }]);
//     setRowModesModel((oldModel) => ({
//       ...oldModel,
//       [id]: { mode: GridRowModes.Edit, fieldToFocus: 'name' },
//     }));
//   };

//   return (
//     <GridToolbarContainer>
//       <Button color="primary" starticon={<AddIcon />} onClick={handleClick}>
//         Add record
//       </Button>
//     </GridToolbarContainer>
//   );
// }


export const TestlistPage = () => {

  const [deviceList, setDeviceList] = useContext(DataContext).deviceList
  const [rowModesModel, setRowModesModel] = useState({});
  const deviceNameList = deviceList?.map((deviceName) => deviceName.Device);
  
  const handleRowEditStop = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const handleEditClick = (id) => () => {
    console.log(id)
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (item) => () => {
    setRowModesModel({ ...rowModesModel, [item.id]: { mode: GridRowModes.View } });
  };

  const handleDeleteClick = (_id) => async () => {
    const removeDeviceResponse = await client.entities.test.remove(_id)
    console.log(removeDeviceResponse)
    setRows(rows.filter((row) => row._id !== _id));
  };

  const handleCancelClick = (id) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });

    const editedRow = rows.find((row) => row.id === id);
    if (editedRow.isNew) {
      setRows(rows.filter((row) => row.id !== id));
    }
  };

  const processRowUpdate = async(newRow, oldRow) => {
    // console.log(newRow)
    const updateDeviceResponse = await client.entities.test.update({
      _id: newRow._id,
      Device: newRow.device,
      TestName: newRow.testname,
      TestMethod: newRow.testmethod,
      Notes: newRow.notes,
      Completed: newRow.completed,
      UpdatedBy: newRow.updatedby
    })
    console.log(updateDeviceResponse)
    const updatedRow = { ...newRow, isNew: false };
    setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
    return updatedRow;
  };

  const onProcessRowUpdateError = (newRow, oldRow) => {
    const updatedRow = { ...oldRow, isNew: false };
    setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
  }

  const handleRowModesModelChange = (newRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const { deviceName } = useParams()
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
        objectContainer._id = item._id
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
  },[])

  const columns = [
    {
      field: '_id',
      headerName: '_id',
      hideable: false,
      width: 90
    },
    {
      field: 'id',
      headerName: 'TestID',
      width: 90
    },
    {
      field: 'device',
      headerName: 'Device',
      type: 'singleSelect',
      valueOptions: deviceNameList,
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
      type: 'boolean',
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
      headerName: 'Actions',
      width: 100,
      cellClassName: 'actions',

      getActions: (item) => {
        const isInEditMode = rowModesModel[item.id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<SaveIcon />}
              label="Save"
              sx={{
                color: 'primary.main',
              }}
              onClick={handleSaveClick(item)}
            />,
            <GridActionsCellItem
              icon={<CancelIcon />}
              label="Cancel"
              className="textPrimary"
              onClick={handleCancelClick(item.id)}
              color="inherit"
            />,
          ];
        }

        return [
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            className="textPrimary"
            onClick={handleEditClick(item.id)}
            color="inherit"
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={handleDeleteClick(item.row._id)}
            color="inherit"
          />,
        ];
      },
    },

  ];

  return (
    <div className="test-list-page">
      <div><h2 id="subtitle-name">Test List for: {deviceName}</h2></div>
      <div className="test-list-data">
      
        <Box sx={{ height: 400, width: '100%', borderColor: 'primary.dark', '& .MuiDataGrid-cell:hover': {color: 'primary.main'} }} >
          <Container>

            <DataGrid className='test-list-data-table'
              rows={rows}
              columns={columns}
            components={{Toolbar: () => {
              return <GridToolbarContainer sx={{justifyContent: 'flex-end'}}>
                <GridToolbarColumnsButton />
                <GridToolbarFilterButton />
              </GridToolbarContainer>
            }}}
              editMode='row'
              rowModesModel={rowModesModel}
              onRowModesModelChange={handleRowModesModelChange}
              onRowEditStop={handleRowEditStop}
              processRowUpdate={processRowUpdate}
              onProcessRowUpdateError={onProcessRowUpdateError}
              initialState={{
              sorting: { sortModel: [{field: 'id', sort: 'asc'}]},
                columns: {
                  columnVisibilityModel: {
                    // Hide columns status and traderName, the other columns will remain visible
                    _id: false,
                  },
                },
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