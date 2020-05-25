/*
 * Code generated by Microsoft (R) AutoRest Code Generator.
 * Changes may cause incorrect behavior and will be lost if the code is
 * regenerated.
 */

import * as msRest from "@azure/ms-rest-js";


export const CredentialsCreationRequest: msRest.CompositeMapper = {
  serializedName: "CredentialsCreationRequest",
  type: {
    name: "Composite",
    className: "CredentialsCreationRequest",
    modelProperties: {
      domain: {
        required: true,
        serializedName: "domain",
        type: {
          name: "String"
        }
      },
      name: {
        serializedName: "name",
        type: {
          name: "String"
        }
      }
    }
  }
};

export const ProblemDetails: msRest.CompositeMapper = {
  serializedName: "ProblemDetails",
  type: {
    name: "Composite",
    className: "ProblemDetails",
    modelProperties: {
      type: {
        serializedName: "type",
        type: {
          name: "String"
        }
      },
      title: {
        serializedName: "title",
        type: {
          name: "String"
        }
      },
      status: {
        nullable: true,
        serializedName: "status",
        type: {
          name: "Number"
        }
      },
      detail: {
        serializedName: "detail",
        type: {
          name: "String"
        }
      },
      instance: {
        serializedName: "instance",
        type: {
          name: "String"
        }
      },
      extensions: {
        serializedName: "extensions",
        type: {
          name: "Dictionary",
          value: {
            type: {
              name: "Object"
            }
          }
        }
      }
    }
  }
};

export const Credentials: msRest.CompositeMapper = {
  serializedName: "Credentials",
  type: {
    name: "Composite",
    className: "Credentials",
    modelProperties: {
      id: {
        required: true,
        serializedName: "id",
        type: {
          name: "Uuid"
        }
      },
      domain: {
        required: true,
        serializedName: "domain",
        type: {
          name: "String"
        }
      },
      name: {
        serializedName: "name",
        type: {
          name: "String"
        }
      },
      type: {
        serializedName: "type",
        type: {
          name: "String"
        }
      },
      token: {
        serializedName: "token",
        type: {
          name: "String"
        }
      },
      secret: {
        serializedName: "secret",
        type: {
          name: "String"
        }
      },
      environment: {
        serializedName: "environment",
        type: {
          name: "String"
        }
      },
      owner: {
        serializedName: "owner",
        type: {
          name: "String"
        }
      }
    }
  }
};

export const CredentialsCreationWithEmailAndPasswordRequest: msRest.CompositeMapper = {
  serializedName: "CredentialsCreationWithEmailAndPasswordRequest",
  type: {
    name: "Composite",
    className: "CredentialsCreationWithEmailAndPasswordRequest",
    modelProperties: {
      email: {
        required: true,
        serializedName: "email",
        type: {
          name: "String"
        }
      },
      password: {
        required: true,
        serializedName: "password",
        type: {
          name: "String"
        }
      },
      domain: {
        required: true,
        serializedName: "domain",
        type: {
          name: "String"
        }
      },
      name: {
        serializedName: "name",
        type: {
          name: "String"
        }
      }
    }
  }
};

export const WaitForCredentialsApprovalRequest: msRest.CompositeMapper = {
  serializedName: "WaitForCredentialsApprovalRequest",
  type: {
    name: "Composite",
    className: "WaitForCredentialsApprovalRequest",
    modelProperties: {
      token: {
        required: true,
        serializedName: "token",
        type: {
          name: "String"
        }
      },
      waitTimeMillis: {
        nullable: true,
        serializedName: "waitTimeMillis",
        type: {
          name: "Number"
        }
      }
    }
  }
};

export const FieldRestrictions: msRest.CompositeMapper = {
  serializedName: "FieldRestrictions",
  type: {
    name: "Composite",
    className: "FieldRestrictions",
    modelProperties: {
      choices: {
        serializedName: "choices",
        type: {
          name: "Sequence",
          element: {
            type: {
              name: "String"
            }
          }
        }
      },
      valueRequired: {
        serializedName: "valueRequired",
        type: {
          name: "Boolean"
        }
      }
    }
  }
};

export const DataTableColumn: msRest.CompositeMapper = {
  serializedName: "DataTableColumn",
  type: {
    name: "Composite",
    className: "DataTableColumn",
    modelProperties: {
      name: {
        serializedName: "name",
        type: {
          name: "String"
        }
      },
      type: {
        serializedName: "type",
        type: {
          name: "String"
        }
      },
      referenceName: {
        serializedName: "referenceName",
        type: {
          name: "String"
        }
      },
      restrictions: {
        serializedName: "restrictions",
        type: {
          name: "Composite",
          className: "FieldRestrictions"
        }
      }
    }
  }
};

export const DataTable: msRest.CompositeMapper = {
  serializedName: "DataTable",
  type: {
    name: "Composite",
    className: "DataTable",
    modelProperties: {
      id: {
        required: true,
        serializedName: "id",
        type: {
          name: "Uuid"
        }
      },
      dataTableId: {
        serializedName: "dataTableId",
        type: {
          name: "Uuid"
        }
      },
      referenceName: {
        serializedName: "referenceName",
        type: {
          name: "String"
        }
      },
      name: {
        required: true,
        serializedName: "name",
        type: {
          name: "String"
        }
      },
      teamName: {
        required: true,
        serializedName: "teamName",
        type: {
          name: "String"
        }
      },
      description: {
        serializedName: "description",
        type: {
          name: "String"
        }
      },
      columns: {
        serializedName: "columns",
        type: {
          name: "Sequence",
          element: {
            type: {
              name: "Composite",
              className: "DataTableColumn"
            }
          }
        }
      },
      isArchived: {
        serializedName: "isArchived",
        type: {
          name: "Boolean"
        }
      },
      type: {
        serializedName: "type",
        type: {
          name: "String"
        }
      },
      visibility: {
        serializedName: "visibility",
        type: {
          name: "String"
        }
      },
      visibleToUsers: {
        serializedName: "visibleToUsers",
        type: {
          name: "Sequence",
          element: {
            type: {
              name: "String"
            }
          }
        }
      },
      rowLimit: {
        serializedName: "rowLimit",
        type: {
          name: "Number"
        }
      },
      columnLimit: {
        serializedName: "columnLimit",
        type: {
          name: "Number"
        }
      },
      cellLimit: {
        serializedName: "cellLimit",
        type: {
          name: "Number"
        }
      }
    }
  }
};

export const PagingOptions: msRest.CompositeMapper = {
  serializedName: "PagingOptions",
  type: {
    name: "Composite",
    className: "PagingOptions",
    modelProperties: {
      size: {
        serializedName: "size",
        type: {
          name: "Number"
        }
      },
      pageToken: {
        serializedName: "pageToken",
        type: {
          name: "String"
        }
      },
      getAllResults: {
        serializedName: "getAllResults",
        type: {
          name: "Boolean"
        }
      }
    }
  }
};

export const DataTablesPage: msRest.CompositeMapper = {
  serializedName: "DataTablesPage",
  type: {
    name: "Composite",
    className: "DataTablesPage",
    modelProperties: {
      dataTables: {
        serializedName: "dataTables",
        type: {
          name: "Sequence",
          element: {
            type: {
              name: "Composite",
              className: "DataTable"
            }
          }
        }
      },
      nextPageOptions: {
        serializedName: "nextPageOptions",
        type: {
          name: "Composite",
          className: "PagingOptions"
        }
      },
      nextPageToken: {
        serializedName: "nextPageToken",
        type: {
          name: "String"
        }
      },
      count: {
        serializedName: "count",
        type: {
          name: "Number"
        }
      }
    }
  }
};

export const FileMetadata: msRest.CompositeMapper = {
  serializedName: "FileMetadata",
  type: {
    name: "Composite",
    className: "FileMetadata",
    modelProperties: {
      id: {
        serializedName: "id",
        type: {
          name: "Uuid"
        }
      },
      name: {
        serializedName: "name",
        type: {
          name: "String"
        }
      },
      teamName: {
        serializedName: "teamName",
        type: {
          name: "String"
        }
      },
      contentType: {
        serializedName: "contentType",
        type: {
          name: "String"
        }
      },
      sizeInBytes: {
        serializedName: "sizeInBytes",
        type: {
          name: "Number"
        }
      },
      displaySize: {
        serializedName: "displaySize",
        type: {
          name: "String"
        }
      },
      isPublic: {
        serializedName: "isPublic",
        type: {
          name: "Boolean"
        }
      },
      md5Hash: {
        serializedName: "md5Hash",
        type: {
          name: "String"
        }
      },
      referenceName: {
        serializedName: "referenceName",
        type: {
          name: "String"
        }
      }
    }
  }
};

export const FileMetadataPage: msRest.CompositeMapper = {
  serializedName: "FileMetadataPage",
  type: {
    name: "Composite",
    className: "FileMetadataPage",
    modelProperties: {
      files: {
        serializedName: "files",
        type: {
          name: "Sequence",
          element: {
            type: {
              name: "Composite",
              className: "FileMetadata"
            }
          }
        }
      },
      nextPageOptions: {
        serializedName: "nextPageOptions",
        type: {
          name: "Composite",
          className: "PagingOptions"
        }
      },
      nextPageToken: {
        serializedName: "nextPageToken",
        type: {
          name: "String"
        }
      },
      count: {
        serializedName: "count",
        type: {
          name: "Number"
        }
      }
    }
  }
};

export const Field: msRest.CompositeMapper = {
  serializedName: "Field",
  type: {
    name: "Composite",
    className: "Field",
    modelProperties: {
      id: {
        serializedName: "id",
        type: {
          name: "Uuid"
        }
      },
      name: {
        serializedName: "name",
        type: {
          name: "String"
        }
      },
      referenceName: {
        serializedName: "referenceName",
        type: {
          name: "String"
        }
      },
      description: {
        serializedName: "description",
        type: {
          name: "String"
        }
      },
      position: {
        serializedName: "position",
        type: {
          name: "Number"
        }
      },
      restrictions: {
        serializedName: "restrictions",
        type: {
          name: "Composite",
          className: "FieldRestrictions"
        }
      },
      fieldType: {
        serializedName: "fieldType",
        type: {
          name: "String"
        }
      },
      value: {
        serializedName: "value",
        type: {
          name: "String"
        }
      },
      defaultValue: {
        serializedName: "defaultValue",
        type: {
          name: "String"
        }
      }
    }
  }
};

export const InstanceStep: msRest.CompositeMapper = {
  serializedName: "InstanceStep",
  type: {
    name: "Composite",
    className: "InstanceStep",
    modelProperties: {
      id: {
        required: true,
        serializedName: "id",
        type: {
          name: "Uuid"
        }
      },
      instanceId: {
        required: true,
        serializedName: "instanceId",
        type: {
          name: "Uuid"
        }
      },
      workflowId: {
        required: true,
        serializedName: "workflowId",
        type: {
          name: "Uuid"
        }
      },
      name: {
        required: true,
        serializedName: "name",
        type: {
          name: "String"
        }
      },
      teamName: {
        required: true,
        serializedName: "teamName",
        type: {
          name: "String"
        }
      },
      position: {
        serializedName: "position",
        type: {
          name: "Number"
        }
      },
      description: {
        serializedName: "description",
        type: {
          name: "String"
        }
      },
      status: {
        serializedName: "status",
        type: {
          name: "String"
        }
      },
      assignedTo: {
        serializedName: "assignedTo",
        type: {
          name: "String"
        }
      },
      outputFields: {
        serializedName: "outputFields",
        type: {
          name: "Sequence",
          element: {
            type: {
              name: "Composite",
              className: "Field"
            }
          }
        }
      }
    }
  }
};

export const Instance: msRest.CompositeMapper = {
  serializedName: "Instance",
  type: {
    name: "Composite",
    className: "Instance",
    modelProperties: {
      id: {
        required: true,
        serializedName: "id",
        type: {
          name: "Uuid"
        }
      },
      workflowId: {
        required: true,
        serializedName: "workflowId",
        type: {
          name: "Uuid"
        }
      },
      name: {
        serializedName: "name",
        type: {
          name: "String"
        }
      },
      teamName: {
        required: true,
        serializedName: "teamName",
        type: {
          name: "String"
        }
      },
      description: {
        serializedName: "description",
        type: {
          name: "String"
        }
      },
      category: {
        serializedName: "category",
        type: {
          name: "String"
        }
      },
      owner: {
        serializedName: "owner",
        type: {
          name: "String"
        }
      },
      createdBy: {
        serializedName: "createdBy",
        type: {
          name: "String"
        }
      },
      steps: {
        serializedName: "steps",
        type: {
          name: "Sequence",
          element: {
            type: {
              name: "Composite",
              className: "InstanceStep"
            }
          }
        }
      },
      fields: {
        serializedName: "fields",
        type: {
          name: "Sequence",
          element: {
            type: {
              name: "Composite",
              className: "Field"
            }
          }
        }
      },
      status: {
        serializedName: "status",
        type: {
          name: "String"
        }
      },
      fieldVisibility: {
        serializedName: "fieldVisibility",
        type: {
          name: "String"
        }
      },
      visibility: {
        serializedName: "visibility",
        type: {
          name: "String"
        }
      },
      visibleToUsers: {
        serializedName: "visibleToUsers",
        type: {
          name: "Sequence",
          element: {
            type: {
              name: "String"
            }
          }
        }
      }
    }
  }
};

export const InstancesPage: msRest.CompositeMapper = {
  serializedName: "InstancesPage",
  type: {
    name: "Composite",
    className: "InstancesPage",
    modelProperties: {
      instances: {
        serializedName: "instances",
        type: {
          name: "Sequence",
          element: {
            type: {
              name: "Composite",
              className: "Instance"
            }
          }
        }
      },
      nextPageOptions: {
        serializedName: "nextPageOptions",
        type: {
          name: "Composite",
          className: "PagingOptions"
        }
      },
      nextPageToken: {
        serializedName: "nextPageToken",
        type: {
          name: "String"
        }
      },
      count: {
        serializedName: "count",
        type: {
          name: "Number"
        }
      }
    }
  }
};

export const FieldUpdateRequest: msRest.CompositeMapper = {
  serializedName: "FieldUpdateRequest",
  type: {
    name: "Composite",
    className: "FieldUpdateRequest",
    modelProperties: {
      name: {
        serializedName: "name",
        type: {
          name: "String"
        }
      },
      referenceName: {
        serializedName: "referenceName",
        type: {
          name: "String"
        }
      },
      value: {
        serializedName: "value",
        type: {
          name: "String"
        }
      }
    }
  }
};

export const StartInstanceRequest: msRest.CompositeMapper = {
  serializedName: "StartInstanceRequest",
  type: {
    name: "Composite",
    className: "StartInstanceRequest",
    modelProperties: {
      workflowId: {
        serializedName: "workflowId",
        type: {
          name: "Uuid"
        }
      },
      name: {
        serializedName: "name",
        type: {
          name: "String"
        }
      },
      description: {
        serializedName: "description",
        type: {
          name: "String"
        }
      },
      inputFields: {
        serializedName: "inputFields",
        type: {
          name: "Sequence",
          element: {
            type: {
              name: "Composite",
              className: "FieldUpdateRequest"
            }
          }
        }
      }
    }
  }
};

export const InstanceStepsPage: msRest.CompositeMapper = {
  serializedName: "InstanceStepsPage",
  type: {
    name: "Composite",
    className: "InstanceStepsPage",
    modelProperties: {
      steps: {
        serializedName: "steps",
        type: {
          name: "Sequence",
          element: {
            type: {
              name: "Composite",
              className: "InstanceStep"
            }
          }
        }
      },
      nextPageOptions: {
        serializedName: "nextPageOptions",
        type: {
          name: "Composite",
          className: "PagingOptions"
        }
      },
      nextPageToken: {
        serializedName: "nextPageToken",
        type: {
          name: "String"
        }
      },
      count: {
        serializedName: "count",
        type: {
          name: "Number"
        }
      }
    }
  }
};

export const CompleteStepRequest: msRest.CompositeMapper = {
  serializedName: "CompleteStepRequest",
  type: {
    name: "Composite",
    className: "CompleteStepRequest",
    modelProperties: {
      id: {
        serializedName: "id",
        type: {
          name: "Uuid"
        }
      },
      stepOutputFields: {
        serializedName: "stepOutputFields",
        type: {
          name: "Sequence",
          element: {
            type: {
              name: "Composite",
              className: "FieldUpdateRequest"
            }
          }
        }
      }
    }
  }
};

export const ReassignStepRequest: msRest.CompositeMapper = {
  serializedName: "ReassignStepRequest",
  type: {
    name: "Composite",
    className: "ReassignStepRequest",
    modelProperties: {
      id: {
        serializedName: "id",
        type: {
          name: "Uuid"
        }
      },
      assignTo: {
        serializedName: "assignTo",
        type: {
          name: "String"
        }
      }
    }
  }
};

export const CredentialsPage: msRest.CompositeMapper = {
  serializedName: "CredentialsPage",
  type: {
    name: "Composite",
    className: "CredentialsPage",
    modelProperties: {
      credentials: {
        serializedName: "credentials",
        type: {
          name: "Sequence",
          element: {
            type: {
              name: "Composite",
              className: "Credentials"
            }
          }
        }
      },
      nextPageOptions: {
        serializedName: "nextPageOptions",
        type: {
          name: "Composite",
          className: "PagingOptions"
        }
      },
      nextPageToken: {
        serializedName: "nextPageToken",
        type: {
          name: "String"
        }
      },
      count: {
        serializedName: "count",
        type: {
          name: "Number"
        }
      }
    }
  }
};

export const User: msRest.CompositeMapper = {
  serializedName: "User",
  type: {
    name: "Composite",
    className: "User",
    modelProperties: {
      id: {
        required: true,
        serializedName: "id",
        type: {
          name: "Uuid"
        }
      },
      username: {
        serializedName: "username",
        type: {
          name: "String"
        }
      },
      email: {
        required: true,
        serializedName: "email",
        type: {
          name: "String"
        }
      },
      fullName: {
        required: true,
        serializedName: "fullName",
        type: {
          name: "String"
        }
      },
      teamName: {
        required: true,
        serializedName: "teamName",
        type: {
          name: "String"
        }
      }
    }
  }
};

export const UsersPage: msRest.CompositeMapper = {
  serializedName: "UsersPage",
  type: {
    name: "Composite",
    className: "UsersPage",
    modelProperties: {
      users: {
        serializedName: "users",
        type: {
          name: "Sequence",
          element: {
            type: {
              name: "Composite",
              className: "User"
            }
          }
        }
      },
      nextPageOptions: {
        serializedName: "nextPageOptions",
        type: {
          name: "Composite",
          className: "PagingOptions"
        }
      },
      nextPageToken: {
        serializedName: "nextPageToken",
        type: {
          name: "String"
        }
      },
      count: {
        serializedName: "count",
        type: {
          name: "Number"
        }
      }
    }
  }
};

export const Workflow: msRest.CompositeMapper = {
  serializedName: "Workflow",
  type: {
    name: "Composite",
    className: "Workflow",
    modelProperties: {
      id: {
        required: true,
        serializedName: "id",
        type: {
          name: "Uuid"
        }
      },
      name: {
        required: true,
        serializedName: "name",
        type: {
          name: "String"
        }
      },
      teamName: {
        required: true,
        serializedName: "teamName",
        type: {
          name: "String"
        }
      },
      description: {
        serializedName: "description",
        type: {
          name: "String"
        }
      },
      category: {
        serializedName: "category",
        type: {
          name: "String"
        }
      },
      owner: {
        serializedName: "owner",
        type: {
          name: "String"
        }
      },
      createdBy: {
        serializedName: "createdBy",
        type: {
          name: "String"
        }
      },
      inputFields: {
        serializedName: "inputFields",
        type: {
          name: "Sequence",
          element: {
            type: {
              name: "Composite",
              className: "Field"
            }
          }
        }
      },
      isPublished: {
        serializedName: "isPublished",
        type: {
          name: "Boolean"
        }
      },
      isArchived: {
        serializedName: "isArchived",
        type: {
          name: "Boolean"
        }
      },
      fieldVisibility: {
        serializedName: "fieldVisibility",
        type: {
          name: "String"
        }
      },
      instanceVisibility: {
        serializedName: "instanceVisibility",
        type: {
          name: "String"
        }
      },
      adminUsers: {
        serializedName: "adminUsers",
        type: {
          name: "Sequence",
          element: {
            type: {
              name: "String"
            }
          }
        }
      },
      standardUsers: {
        serializedName: "standardUsers",
        type: {
          name: "Sequence",
          element: {
            type: {
              name: "String"
            }
          }
        }
      },
      taskCountLimit: {
        serializedName: "taskCountLimit",
        type: {
          name: "Number"
        }
      },
      fieldCountLimit: {
        serializedName: "fieldCountLimit",
        type: {
          name: "Number"
        }
      },
      fieldSizeLimit: {
        serializedName: "fieldSizeLimit",
        type: {
          name: "Number"
        }
      },
      fieldTotalSizeLimit: {
        serializedName: "fieldTotalSizeLimit",
        type: {
          name: "Number"
        }
      },
      dataTableRowLimit: {
        serializedName: "dataTableRowLimit",
        type: {
          name: "Number"
        }
      },
      dataTableColumnLimit: {
        serializedName: "dataTableColumnLimit",
        type: {
          name: "Number"
        }
      },
      dataTableCellLimit: {
        serializedName: "dataTableCellLimit",
        type: {
          name: "Number"
        }
      }
    }
  }
};

export const WorkflowsPage: msRest.CompositeMapper = {
  serializedName: "WorkflowsPage",
  type: {
    name: "Composite",
    className: "WorkflowsPage",
    modelProperties: {
      workflows: {
        serializedName: "workflows",
        type: {
          name: "Sequence",
          element: {
            type: {
              name: "Composite",
              className: "Workflow"
            }
          }
        }
      },
      nextPageOptions: {
        serializedName: "nextPageOptions",
        type: {
          name: "Composite",
          className: "PagingOptions"
        }
      },
      nextPageToken: {
        serializedName: "nextPageToken",
        type: {
          name: "String"
        }
      },
      count: {
        serializedName: "count",
        type: {
          name: "Number"
        }
      }
    }
  }
};

export const WorkflowImportRequest: msRest.CompositeMapper = {
  serializedName: "WorkflowImportRequest",
  type: {
    name: "Composite",
    className: "WorkflowImportRequest",
    modelProperties: {
      fileId: {
        serializedName: "fileId",
        type: {
          name: "Uuid"
        }
      },
      password: {
        serializedName: "password",
        type: {
          name: "String"
        }
      }
    }
  }
};

export const WorkflowImport: msRest.CompositeMapper = {
  serializedName: "WorkflowImport",
  type: {
    name: "Composite",
    className: "WorkflowImport",
    modelProperties: {
      id: {
        serializedName: "id",
        type: {
          name: "Uuid"
        }
      },
      name: {
        serializedName: "name",
        type: {
          name: "String"
        }
      },
      workflowId: {
        serializedName: "workflowId",
        type: {
          name: "Uuid"
        }
      },
      errorMessage: {
        serializedName: "errorMessage",
        type: {
          name: "String"
        }
      }
    }
  }
};

export const WorkflowExportRequest: msRest.CompositeMapper = {
  serializedName: "WorkflowExportRequest",
  type: {
    name: "Composite",
    className: "WorkflowExportRequest",
    modelProperties: {
      workflowId: {
        serializedName: "workflowId",
        type: {
          name: "Uuid"
        }
      },
      password: {
        serializedName: "password",
        type: {
          name: "String"
        }
      }
    }
  }
};

export const WorkflowExport: msRest.CompositeMapper = {
  serializedName: "WorkflowExport",
  type: {
    name: "Composite",
    className: "WorkflowExport",
    modelProperties: {
      id: {
        serializedName: "id",
        type: {
          name: "Uuid"
        }
      },
      name: {
        serializedName: "name",
        type: {
          name: "String"
        }
      },
      fileId: {
        serializedName: "fileId",
        type: {
          name: "Uuid"
        }
      },
      errorMessage: {
        serializedName: "errorMessage",
        type: {
          name: "String"
        }
      }
    }
  }
};
