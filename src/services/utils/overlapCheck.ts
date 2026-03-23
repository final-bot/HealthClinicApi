interface AppointmentData {
    clinicianId: string;
    start: Date;
    end: Date;
}

interface Appointment {
    id: string;
    clinicianId: string;
    start: Date;
    end: Date;
    deletedAt: Date | null;
    // add other fields as needed
}

interface AppointmentTx {
    appointment: {
        findFirst: (args: {
            where: {
                clinicianId: string;
                deletedAt: null;
                start: { lt: Date };
                end: { gt: Date };
            };
        }) => Promise<Appointment | null>;
    };
}

export async function checkOverlap(
    tx: AppointmentTx,
    data: AppointmentData
): Promise<Appointment | null> {
    return tx.appointment.findFirst({
        where: {
            clinicianId: data.clinicianId,
            deletedAt: null,
            start: { lt: data.end },
            end: { gt: data.start },
        },
    });
}