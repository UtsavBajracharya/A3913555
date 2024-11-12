-- Create the Expenses table
CREATE TABLE Expenses (
    id INT IDENTITY(1,1) PRIMARY KEY,
    category VARCHAR(50) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    date DATE NOT NULL,
    description VARCHAR(255),
    created_at DATETIME DEFAULT GETDATE()
);